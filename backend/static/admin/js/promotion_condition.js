/**
 * Показывает только те поля акции, которые нужны выбранному типу.
 *
 *   Обычная                     -> ничего дополнительного
 *   От количества товара        -> min_quantity
 *   При покупке другого товара  -> required_product, required_quantity
 *
 * Скрытие чисто визуальное: серверная валидация (Promotion.clean())
 * всё равно проверяет обязательные поля, поэтому даже при отключённом
 * JS некорректную акцию сохранить не получится.
 */
(function () {
  "use strict";

  var FIELDS_BY_TYPE = {
    always: [],
    min_quantity: ["min_quantity"],
    requires_product: ["required_product", "required_quantity"],
  };

  var ALL_FIELDS = ["min_quantity", "required_product", "required_quantity"];

  /** Ищет контейнер строки формы для поля — разметка Unfold/Django. */
  function rowFor(input) {
    return (
      input.closest(".form-row") ||
      input.closest(".field-box") ||
      input.closest("fieldset > div") ||
      input.parentElement
    );
  }

  /** Находит input/select поля внутри блока инлайна по имени. */
  function inputFor(scope, fieldName) {
    return scope.querySelector(
      '[name$="' + fieldName + '"]:not([type="hidden"])'
    );
  }

  function applyVisibility(select) {
    // Инлайн может быть не один — работаем строго внутри своего блока.
    var scope =
      select.closest(".inline-related") ||
      select.closest("fieldset") ||
      document;

    var visible = FIELDS_BY_TYPE[select.value] || [];

    ALL_FIELDS.forEach(function (fieldName) {
      var input = inputFor(scope, fieldName);
      if (!input) {
        return;
      }
      var row = rowFor(input);
      if (!row) {
        return;
      }
      row.style.display = visible.indexOf(fieldName) === -1 ? "none" : "";
    });
  }

  function init() {
    var selects = document.querySelectorAll('select[name$="condition_type"]');

    selects.forEach(function (select) {
      applyVisibility(select);
      select.addEventListener("change", function () {
        applyVisibility(select);
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();