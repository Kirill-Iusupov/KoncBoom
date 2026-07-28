/**
 * Делает клик по любой точке строки списка в Django Admin переходом
 * по ссылке этой строки (обычно из list_display_links) — не только
 * по самому тексту ссылки.
 *
 * Безопасно для чекбоксов, других ссылок, кнопок и полей
 * list_editable внутри строки — клик по ним обрабатывается как обычно,
 * перехода по строке не происходит.
 */
document.addEventListener("DOMContentLoaded", function () {
  var rows = document.querySelectorAll("#result_list tbody tr");

  rows.forEach(function (row) {
    var link = row.querySelector("th a, td a");
    if (!link) {
      return;
    }

    row.style.cursor = "pointer";

    row.addEventListener("click", function (event) {
      var interactive = event.target.closest(
        "a, input, button, select, label, textarea"
      );
      if (interactive) {
        return;
      }
      window.location = link.getAttribute("href");
    });
  });
});