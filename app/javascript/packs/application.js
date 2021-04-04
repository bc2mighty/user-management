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
    let pages = 1;
    let users = []

    // $('#table').DataTable( {
    //     autoFill: true,
    //     paging: false,
    //     data: data,
    //     columns: [
    //         { data: 'name' },
    //         { data: 'email' },
    //         { data: 'phone' },
    //         { data: 'title' }
    //     ]
    
    // });

    $.ajax({
        url: `${api_url}/users?page=1`,
        method: 'GET',
        success: function(data) {
            pages = parseInt(data.pages)
            let count = 0
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

            let link_tags = ``
            for(let i = 1; i <= pages; i++) {
                if(i > 10) break
                link_tags += `<a class="page-link page-number">${i}</a>`
            }
            $(link_tags).insertAfter($(`.page-append`))
        },
        error: function(e) {
            console.log(e);
        }
    })
})