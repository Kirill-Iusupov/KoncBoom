import { Logo } from "@/src/shared/ui/Logo";
import { ReactNode } from "react";

export type TypeFooter = {
    logo?:ReactNode
    description?: string
    navItems: TypeNavItem[]
}

export type TypeNavItem = {
    title: string
    list: ListLink[]
}

type ListLink = {
    titleHtml: string
    link?: string
}


export const footer_items: TypeFooter = {
    logo: <Logo />,
    description: "Канцелярский магазин в Бишкеке. <br/> Работаем с 2020 года. Опт и розница.",
    navItems: [

        {
            title: "Контакты",
            list: [
                {
                    titleHtml: '📍  <strong> Адрес</strong>: пр.Чынгыз Айтматова 58',
                    link:''
                },
                {
                    titleHtml: '📞 <strong>Телефон</strong>: +996 557 78-75-78',
                    link:''
                },
                {
                    titleHtml: '🗓 <strong>График</strong>: ПН-ПТ 8:00 до 21:00 / СБ-ВС 10:00 до 20:00',
                    link:''
                },

            ]
        },
        {
            title: "Каталог",
            list: [
                {
                    titleHtml: 'Письменные принадлежности',
                    link:''
                },
                {
                    titleHtml: 'Бумага и блокноты',
                    link:''
                },
                {
                    titleHtml: 'Папки и файлы',
                    link:''
                },
                {
                    titleHtml: 'Рисование',
                    link:''
                },
                {
                    titleHtml: 'Офисные товары',
                    link:''
                },

            ]
        },
        {
            title: "Доставка и оплата",
            list: [
                {
                    titleHtml: 'Доставка и оплата',
                    link:''
                },
                {
                    titleHtml: 'Возврат товара',
                    link:''
                },
                {
                    titleHtml: 'Оптовые заказы',
                    link:''
                },
                {
                    titleHtml: 'Контакты',
                    link:''
                },

            ]
        },
    ]
}