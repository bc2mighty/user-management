// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/javascript and only use these pack files to reference
// that code so it'll be compiled.

import Rails from "@rails/ujs"
import Turbolinks from "turbolinks"
import * as ActiveStorage from "@rails/activestorage"
import "channels"

Rails.start()
Turbolinks.start()
ActiveStorage.start()

$(document).ready(function() {
    let api_url = 'https://powerful-beach-60906.herokuapp.com/api/v1';
    let users = [];
    let page = 1;
    let id

    var table = $('#table').DataTable( {
        paging: false,
    });
    
    loadUsers(page)

    $(`.page-prev, .page-next`).on("click", function(e) {
        e.preventDefault()
    })

    $(document).on("click", ".page-number", function(e) {
        e.preventDefault()
        page = parseInt($(this).text())
        loadUsers(page)
    })

    function loadUsers (page) {
        table.destroy()
        $(`tbody`).empty()
        $(`.page-number`).remove()
        
        $.ajax({
            url: `${api_url}/users?page=${page}`,
            method: 'GET',
            success: function(data) {
                let pages = parseInt(data.pages)
                let count = 0
                users = data.data

                renderTable(data, count, pages)
            },
            error: function(e) {
                console.log(e);
            }
        })
    }

    function renderTable(data, count, pages) {
        data.data.forEach(user => {
            let tr = `
                <tr>
                    <td>${++count}</td>
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td>${user.phone}</td>
                    <td>${user.title}</td>
                    <td><span style="color:${user.status ? 'green">active' : 'red">inactive'}</span></td>
                    <td>
                        <a href="#" class="btn btn-edit" user-id="${user.id}">Edit</a>
                        <a href="#" class="btn btn-delete" user-id="${user.id}">Delete</a>
                    </td>
                </tr>
            `
            $(`tbody`).append(tr)
        })

        table = $('#table').DataTable( {
            paging: false,
        });

        let link_tags = ``
        for(let i = 1; i <= pages; i++) {
            link_tags += `<a href="#" class="page-link page-number">${i}</a>`
        }
        $(link_tags).insertAfter($(`.page-append`))
    }

    $(document).on("click", `a.btn`, function(e) {
        e.preventDefault()

        let user_id = $(this).attr('user-id')
        let user = users.filter((usr) => {
            return usr.id == user_id
        })
        
        let {email, phone, name, title, status} = user[0]
        id = user[0].id

        if($(this).hasClass('btn-edit')) {
            $(`#edit-name`).val(name)
            $(`#edit-email`).val(email)
            $(`#edit-phone`).val(phone)
            $(`#edit-title`).val(title)
            $(`select#edit-status option[value=${status ? '1' : '0'}]`).attr('selected', 'true')

            $(`.user-mgt-modal`).show()
            $(`.user-mgt-create-user`).hide()
            $(`.user-mgt-update-user`).show()
        } else if ($(this).hasClass('btn-delete')) {
            if(confirm('Are you sure you want to delete user?')) {
                deleteUser(id)
            }
        }
    })

    $(`.new-user`).click(function(e) {
        e.preventDefault()
        $(`.user-mgt-modal`).show()
        $(`.user-mgt-create-user`).show()
        $(`.user-mgt-update-user`).hide()
    })

    $(`.update-user`).click(function(e) {
        e.preventDefault()
        $(`.user-mgt-modal`).show()
        $(`.user-mgt-create-user`).show()
        $(`.user-mgt-update-user`).hide()
    })

    $(`button.close`).on('click', function(e) {
        e.preventDefault()
        $(`.user-mgt-modal`).hide()
        $(`.user-mgt-create-user`).hide()
        $(`.user-mgt-update-user`).hide()
    })
    
    $(`form.user-mgt-create-form`).on("submit", function(e) {
        e.preventDefault()
        let inputs = $(`form.user-mgt-create-form input, form.user-mgt-create-form select`)
        let validated = true
        let user = {}
        
        $.each(inputs, function() {
            console.log($(this).val());
            if(!$(this).val()) {
                Swal.fire({
                    icon: 'error',
                    title: 'Validation Error',
                    text: `Please Provide ${$(this).attr('id')}`
                })
                validated = false
                $(this).css({'border': '1px solid red'})
                return false
            } else {
                user[$(this).attr('id')] = $(this).val()
                $(this).css({'border': '1px solid #ccc'})
            }
        })

        if(!validated) {
            return false
        }

        addUser(user)
    })
    
    $(`form.user-mgt-update-form`).on("submit", function(e) {
        e.preventDefault()
        let inputs = $(`form.user-mgt-update-form input, form.user-mgt-update-form select`)
        let validated = true
        let user = {}
        
        $.each(inputs, function() {
            console.log($(this).val());
            if(!$(this).val()) {
                Swal.fire({
                    icon: 'error',
                    title: 'Validation Error',
                    text: `Please Provide ${$(this).attr('id').split('-')[1]}`
                })
                validated = false
                $(this).css({'border': '1px solid red'})
                return false
            } else {
                user[$(this).attr('id').split('-')[1]] = $(this).val()
                $(this).css({'border': '1px solid #ccc'})
            }
        })

        if(!validated) {
            return false
        }

        console.log(user, id);
        updateUser(user, id)
    })

    function updateUser(user, id) {
        $.ajax({
            url: `${api_url}/users/${id}`,
            method: 'PUT',
            data: user,
            success: function(data) {
                table.destroy()
                $(`tbody`).empty()
                $(`.page-number`).remove()

                let pages = parseInt(data.pages)
                let count = 0
                users = data.data

                renderTable(data, count, pages)

                $(`.user-mgt-modal`).hide()
                $(`.user-mgt-create-user`).hide()
                $(`.user-mgt-update-user`).hide()

                Swal.fire(
                    'User Updated Successfully!',
                    'success'
                )
            },
            error: function(e) {
                let errors = e.responseJSON.message
                let message = ``
                
                let error_keys = Object.keys(errors);
                
                for(const key of error_keys) {
                    message += `${key}: `
                    message += typeof errors[key] == 'array' ? `${errors[key].join(', ')}. ` : errors[key]
                }

                Swal.fire({
                    icon: 'error',
                    title: 'Validation Error',
                    text: message
                })
            }
        })
    }

    function addUser(user) {
        $.ajax({
            url: `${api_url}/users`,
            method: 'POST',
            data: user,
            success: function(data) {
                table.destroy()
                $(`tbody`).empty()
                $(`.page-number`).remove()

                let pages = parseInt(data.pages)
                let count = 0
                users = data.data

                renderTable(data, count, pages)

                $(`.user-mgt-modal`).hide()
                $(`.user-mgt-create-user`).hide()
                $(`.user-mgt-update-user`).hide()
                
                Swal.fire(
                    'User Created Successfully!',
                    'success'
                )
            },
            error: function(e) {
                let errors = e.responseJSON.message
                let message = ``
                
                let error_keys = Object.keys(errors);
                
                for(const key of error_keys) {
                    message += `${key}: `
                    message += typeof errors[key] == 'array' ? `${errors[key].join(', ')}. ` : errors[key]
                }

                Swal.fire({
                    icon: 'error',
                    title: 'Validation Error',
                    text: message
                })
            }
        })
    }

    function deleteUser(id) {
        $.ajax({
            url: `${api_url}/users/${id}`,
            method: 'DELETE',
            success: function(data) {
                table.destroy()
                $(`tbody`).empty()
                $(`.page-number`).remove()

                let pages = parseInt(data.pages)
                let count = 0
                users = data.data

                renderTable(data, count, pages)

                $(`.user-mgt-modal`).hide()
                $(`.user-mgt-create-user`).hide()
                $(`.user-mgt-update-user`).hide()

                Swal.fire(
                    'User Deleted Successfully!',
                    'success'
                )
            },
            error: function(e) {
                let errors = e.responseJSON.message
                let message = ``
                
                let error_keys = Object.keys(errors);
                
                for(const key of error_keys) {
                    message += `${key}: `
                    message += typeof errors[key] == 'array' ? `${errors[key].join(', ')}. ` : errors[key]
                }

                Swal.fire({
                    icon: 'error',
                    title: 'Validation Error',
                    text: message
                })
            }
        })
    }
})