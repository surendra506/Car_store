define(['jquery', 'mage/dataPost'], function ($) {
    'use strict';

    $(function () {
        function getFormKey() {
            if (window.FORM_KEY) {
                return String(window.FORM_KEY);
            }

            const inputVal = $('input[name="form_key"]').first().val();
            if (inputVal) {
                return inputVal;
            }

            const match = document.cookie.match(/(?:^|; )form_key=([^;]+)/);
            return match ? decodeURIComponent(match[1]) : '';
        }

        // If something blocks Magento's default `data-post` handler,
        // force-submit the `data-post` payload for store switching.
        $(document).on('click', '.switcher-language .switcher-option a, .switcher-store .switcher-option a', function (e) {
            const postData = $(this).attr('data-post');
            if (!postData) {
                return;
            }

            let payload;
            try {
                payload = JSON.parse(postData);
            } catch (err) {
                return;
            }

            if (!payload || !payload.action || !payload.data) {
                return;
            }

            e.preventDefault();
            e.stopPropagation();

            if (!payload.data.form_key) {
                const formKey = getFormKey();
                if (formKey) {
                    payload.data.form_key = formKey;
                }
            }

            const form = $('<form>', {
                method: 'POST',
                action: payload.action
            });

            Object.keys(payload.data).forEach(function (key) {
                $('<input>', {
                    type: 'hidden',
                    name: key,
                    value: payload.data[key]
                }).appendTo(form);
            });

            form.appendTo('body');
            form.trigger('submit');
        });
    });
});
