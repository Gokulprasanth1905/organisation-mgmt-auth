// On load function
async function dashboard(){
    let res = await fetch('/api/dashboard');
    let result = await res.json();

    if(result.status){
        let tbody = document.querySelector("#placerow tbody")
        tbody.innerHTML = ""
        result.records.forEach(element => {
            tbody.innerHTML += `
                <tr>
                    <td>${element.id}</td>
                    <td>${element.first_name}</td>
                    <td>${element.last_name }</td>
                    <td>${element.username}</td>
                    <td>${element.email}</td>
                    <td>${element.phone_number}</td>
                    <td>
                        <span class="role ${element.role.toLowerCase()}">${element.role}</span>
                    </td>
                    <td>${element.department}</td>
                    <td class="actions">
                        <button class="btn edit" data-id="${element.id}">Update</button>
                        <button class="btn delete" data-id="${element.username}">Delete</button>
                    </td>
                </tr>
            `;
        });
    }
}

window.addEventListener("load", dashboard);

// Edit and Delete button click functions

document.addEventListener("click", async (e) => {
    if (e.target.classList.contains("edit")) {

        let row = e.target.closest("tr");

        let form = document.getElementById("editEmployeeForm");

        form.first_name.value = row.children[1].innerText;
        form.last_name.value = row.children[2].innerText;
        form.username.value = row.children[3].innerText;
        form.email.value = row.children[4].innerText;
        form.phone.value = row.children[5].innerText;
        form.role.value = row.children[6].innerText.trim();
        form.department.value = row.children[7].innerText;

        // show form
        document.getElementById("updateForm").classList.remove("hidden");
        document.getElementById("placerow").classList.add("hidden");
        form.username.readOnly = true
        window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }
    else if (e.target.classList.contains("delete")){
        let row = e.target.closest("tr")

        username =  row.children[3].innerText;

        let confirmDelete = confirm(`Are you sure want to Delete ${username} records`)

        if(!confirmDelete){
            return;
        }

        let formData = new FormData();
        formData.append("username", username);

        let res = await fetch("/api/deletedashbord", {
            method: "DELETE",
            body: formData,
            headers: {"X-CSRFToken": document.querySelector("[name=csrfmiddlewaretoken]").value}
        });

        let result = await res.json();

        if(result.status){
            alert(result.msg);
            dashboard();
        }
        else{
            alert(result.msg);
        }
    }
});

// Cancel button
document.getElementById("updateCanelbtn").onclick = () => {
    document.getElementById("editEmployeeForm").reset();
    document.getElementById("updateForm").classList.add("hidden");
    document.getElementById("placerow").classList.remove("hidden");
};

// Save button
document.getElementById("updatesavebtn").onclick = async () => {
    let form = document.getElementById("editEmployeeForm");
    let formData = new FormData(form);

    let res = await fetch('/api/updatedashboard', {
        method: "POST",
        body: formData,
        headers: {"X-CSRFToken": formData.get("csrfmiddlewaretoken")}
    });

    let result = await res.json();

    let msgbox = document.getElementById("msg");

    if(!msgbox){
        msgbox = document.createElement("div");
        msgbox.id = "msg";
        form.appendChild(msgbox)

    }

    if(result.status){
        msgbox.innerText = result.msg
        msgbox.style.color = "green";
        msgbox.style.marginTop = "10px";
        setTimeout(() => {
            document.getElementById("editEmployeeForm").reset();
            document.getElementById("updateForm").classList.add("hidden");
            document.getElementById("placerow").classList.remove("hidden");
            msgbox.innerText = ""
            dashboard();
        }, 1000);
    }
    else{
        msgbox.innerText = result.msg
        msgbox.style.color = "red";
    }
}