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
    let api_url = 'http://127.0.0.1:3000/api/v1';
    let users = [];
    let page = 1;

    var table = $('#table').DataTable( {
        paging: false,
    });
    
    loadUsers(page)

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
                                <a href="#" class="btn btn-edit">Edit</a>
                                <a href="#" class="btn btn-delete">Delete</a>
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
            },
            error: function(e) {
                console.log(e);
            }
        })
    }

    $(`.new-user`).click(function(e) {
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
        console.log(inputs);
    })
})