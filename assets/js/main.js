$( document ).ready(function() {


    const button_menu = $('.burger')
    const menu = $('.elements-header')
    
    

    
    // отрытие меню
    button_menu.click(function() {
        $(this).toggleClass('open');
        menu.toggleClass('open');
    });

    // Закрытие модалок
    $(document).click(function (e) {
        const target = $(e.target)
        if (!target.closest('.burger').length && !target.closest('.elements-header').length) {
            button_menu.removeClass('open');
            menu.removeClass('open');
        }
    });
})  