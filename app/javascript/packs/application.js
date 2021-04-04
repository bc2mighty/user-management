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

    var table = $('#table').DataTable( {
        paging: false,
    });
    
    loadUsers(1)

    $(document).on("click", ".page-number", function(e) {
        e.preventDefault()
        let page = parseInt($(this).text())
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
                console.log(data.data)

                data.data.forEach(user => {
                    let tr = `
                        <tr>
                            <td>${++count}</td>
                            <td>${user.name}</td>
                            <td>${user.email}</td>
                            <td>${user.phone}</td>
                            <td>${user.title}</td>
                            <td><span style="color:${user.status ? 'green">active' : 'red">inactive'}</span></td>
                            <td></td>
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
})