$(() => {
    var emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}\b/;
    const dateRegex = "^[0-9]{2}/[0-9]{2}/[0-9]{4}$";
    const phoneRegex = '^[0-9]{3}-[0-9]{3}-[0-9]{4}$';
    let json = JSON.parse(localStorage.getItem('stores'));
    let bookingId = 1;
    let editMode = false;
    let currentEditBookingId;
    //date picker jquery plugin
    $("#arrival_date").datepicker({ minDate: 0, maxDate: "+1M +10D" });

    //Save button on click button
    $('#submit').click((e) => {
        e.preventDefault();//if invalid input..prevent it from submitting
        let name = $('#name').val();
        let email = $('#email').val();
        let phone = $('#phone').val();
        let arrivalDate = $('#arrival_date').val();
        let adults = $('#adults').val();
        let children = $('#children').val();
        let kayaking = $('#kayaking').is(":checked");
        let watersport = $('#watersport').is(":checked");
        let bungee = $('#bungee').is(":checked");
        let skydiving = $('#skydiving').is(":checked");
        let parachting = $('#parachting').is(":checked");
        let fishing = $('#fishing').is(":checked");
        let status = 'Confirmed';
        if (validate()) {
            if (editMode) {//when submit button is clicked in edit mode
                saveEditedData(name, email, phone, arrivalDate, adults, children, kayaking, watersport, bungee, skydiving, parachting, fishing);
                editMode = false;
                let success = $('.alert-success');
                success.removeClass('topErrorEnable');
                success.text(`Booking is successfully updated with id: ${currentEditBookingId}`);
            } else {
                bookingId = maxBookingID();
                //insert in array new data
                json.push({
                    bookingId, name, email, phone, arrivalDate,
                    adults, children,
                    kayaking, watersport, bungee, skydiving, parachting, fishing, status
                });
                let success = $('.alert-success');
                success.removeClass('topErrorEnable');
                success.text(`Booking is successfully confirmed with id: ${bookingId}`);
            }

            localStorage.setItem('stores', JSON.stringify(json));//update the booking json data in string form
            populateTable();//refresh the html table
            $('.alert-danger').addClass('topErrorEnable');

            clearText();// clear text fields
            //this relaod the page
            setTimeout(() => {
                location.reload();
            }, 2000);
        }

    });

    // get the last booking id for unique booking id
    let maxBookingID = () => {
        if (json && json.length > 0) {
            //this line find the max booking id in json array
            return json.reduce((maxBooking, booking) => maxBooking.bookingId > booking.bookingId ? maxBooking : booking).bookingId + 1;
        }
        return 1;
    }

    //update the data that has been edited in the form
    let saveEditedData = (name, email, phone, arrivalDate, adults, children, kayaking, watersport, bungee, skydiving, parachting, fishing) => {
        for (var i = 0; i < json.length; ++i) {
            if (json[i]['bookingId'] == currentEditBookingId) {
                json[i]['name'] = name;
                json[i]['email'] = email;
                json[i]['phone'] = phone;
                json[i]['arrivalDate'] = arrivalDate;
                json[i]['adults'] = adults;
                json[i]['children'] = children;
                json[i]['kayaking'] = kayaking;
                json[i]['watersport'] = watersport;
                json[i]['bungee'] = bungee;
                json[i]['skydiving'] = skydiving;
                json[i]['parachting'] = parachting;
                json[i]['fishing'] = fishing;
            }
        }
    }

    // clear text feilds
    let clearText = () => {
        $('#name').val('');
        $('#email').val('');
        $('#phone').val('');
        $('#arrival_date').val('');
        $('#adults').val('');
        $('#children').val('');
        $('#kayaking').prop('checked', false);
        $('#watersport').prop('checked', false);
        $('#bungee').prop('checked', false);
        $('#skydiving').prop('checked', false);
        $('#parachting').prop('checked', false);
        $('#fishing').prop('checked', false);
    }

    //this method is use to populate the table
    let populateTable = () => {
        $("#storeTable>tr").remove();
        if (json) {
            json.forEach(rowWriter);
        }
    };

    //row writer this will populate the table dynamically
    const rowWriter = (store, index, array) => {
        $('#storeTable').append(
            `<tr>
				<td> ${store.bookingId} </td>
			    <td> ${store.name} </td>
	  			<td> ${store.email} </td>
	  			<td> ${store.phone} </td>
				<td> ${store.arrivalDate} </td>
	  			<td> ${store.adults} </td>
				<td> ${store.children} </td>
	  			<td> ${store.kayaking} </td>
	  			<td> ${store.watersport} </td>
                <td> ${store.bungee} </td>
	  			<td> ${store.skydiving} </td>
                <td> ${store.parachting} </td>
	  			<td> ${store.fishing} </td>
                <td> ${store.status} </td>
				<td>
                    <button type="button" class="btn btn-secondary" data-d=${store.bookingId}>Edit</button>
                    <button type="button" class="btn btn-warning" data-d=${store.bookingId}>Cancel</button>
                </td>
  			</tr>`);
    };


    //Confirmed Dialog JQuery widget, its reusabe by other control
    let confirmDialog = (message, action, dTitle) => {
        $('<div></div>').appendTo('body')
            .html('<div><h6>' + message + '?</h6></div>')
            .dialog({
                modal: true,
                title: dTitle,
                zIndex: 10000,
                autoOpen: true,
                width: 'auto',
                resizable: false,
                buttons: {
                    Yes: function () {
                        action();
                        $(this).dialog("close");
                    },
                    No: function () {
                        $(this).dialog("close");
                    }
                },
                close: function (event, ui) {
                    $(this).remove();
                }
            });
    };

    //on clear click event
    $('#clear').click((e) => {
        confirmDialog('Are you sure, want to delete all the records?', deleteStore, 'Delete Records');
    });

    //populate the table on page load
    populateTable();

    //delete al the data after clear button is confirmed
    let deleteStore = () => {
        localStorage.clear();
        localStorage.setItem('stores', '[]');
        json = [];
        populateTable();
        bookingId = 1;
    };

    //Edit button on click event
    $(".btn-secondary").on("click", function (event) {
        editMode = true;
        let current_booking_id = event.target.getAttribute('data-d');
        for (var i = 0; i < json.length; ++i) {
            if (json[i]['bookingId'] == current_booking_id) {
                currentEditBookingId = parseInt(current_booking_id);
                $('#name').val(json[i]['name']);
                $('#email').val(json[i]['email']);
                $('#phone').val(json[i]['phone']);
                $('#arrival_date').val(json[i]['arrivalDate']);
                $('#adults').val(json[i]['adults']);
                $('#children').val(json[i]['children']);
                json[i]['kayaking'] ? $('#kayaking').prop('checked', true) : $('#kayaking').prop('checked', false);
                json[i]['watersport'] ? $('#watersport').prop('checked', true) : $('#watersport').prop('checked', false);
                json[i]['bungee'] ? $('#bungee').prop('checked', true) : $('#bungee').prop('checked', false);
                json[i]['skydiving'] ? $('#skydiving').prop('checked', true) : $('#skydiving').prop('checked', false);
                json[i]['parachting'] ? $('#parachting').prop('checked', true) : $('#parachting').prop('checked', false);
                json[i]['fishing'] ? $('#fishing').prop('checked', true) : $('#fishing').prop('checked', false);
            }
        }
    });

    //cancel button on click event
    $('.btn-warning').click((e) => {
        confirmDialog('Are you sure, want to cancel the booking?', cancelBooking, 'Cancel Booking');

    });
    //cancel booking method
    let cancelBooking = () => {
        let current_booking_id = e.target.getAttribute('data-d');
        for (var i = 0; i < json.length; ++i) {
            if (json[i]['bookingId'] == current_booking_id) {
                json[i]['status'] = 'Canceled';
            }
        }
        localStorage.setItem('stores', JSON.stringify(json));
        populateTable();
    }

    //text box focus out events
    $('#arrival_date').focusout(() => {
        trimFunc($('#arrival_date'));
    });
    $('#name').focusout(() => {
        trimFunc($('#name'));
    });
    $('#email').focusout(() => {
        trimFunc($('#email'));
    });
    $('#phone').focusout(() => {
        trimFunc($('#phone'));
    });

    // all validations happen here
    const validate = () => {
        if (!validateName()) {
            errorHandler($('#name'), 'Name');
            return false;
        }
        if (!validateEmail()) {
            errorHandler($('#email'), 'Email');
            return false;
        }
        if (!validatePhone()) {
            errorHandler($('#phone'), 'phone');
            return false;
        }
        if (!dateValidator()) {
            errorHandler($('#arrival_date'), 'arrival date');
            return false;
        }
        return true;
    }

    // error message starts here
    $('.test').focusout((e) => {
        removeRedBorder($(e.target));
        let dateError = $('.alert-danger');
        dateError.addClass('topErrorEnable');

    });

    let removeRedBorder = (textField) => {
        textField.removeClass('errorClass');

    };

    let errorHandler = (textField, msg) => {
        let dateError = $('.alert-danger');
        dateError.text(`Incorrect value for ${msg}.`);
        textField.addClass('errorClass');
        textField.focus();
        dateError.removeClass('topErrorEnable');
        return false;
    }
    //error message handling ends here

    // date validation happens here
    const dateValidator = () => {
        let date = $('#arrival_date').val();
        if (!date) {
            return false;
        }
        let dateStr = date.trim();
        let dateSplitted = dateStr.trim().split('/');
        let dateObj = new Date(dateSplitted[2], dateSplitted[0] - 1, dateSplitted[1]);
        let isValid = dateStr.match(dateRegex)
            && dateObj
            && (dateObj.getMonth() + 1) == dateSplitted[0]
            && dateObj.getDate() == Number(dateSplitted[1]);

        return isValid;
    }

    let validateName = () => {
        let name = $('#name').val();
        if (!name) {
            return false;
        }
        return true;
    }

    let validateEmail = () => {
        let email = $('#email').val();
        if (!email || !email.match(emailPattern)) {
            return false;
        }
        return true;
    }

    let validatePhone = () => {
        let phone = $('#phone').val();
        if (!phone || !phone.match(phoneRegex)) {
            return false;
        }
        return true;
    }
    //validation ends here

    $('#phone').keyup(function () {
        $(this).val($(this).val().replace(/(\d{3})\-?(\d{3})\-?(\d{4})/, '$1-$2-$3'))
    });

    let trimFunc = (element) => {
        let value = element.val();
        if (value) {
            $(element).val(value.trim());
        }
    }

}); // end ready