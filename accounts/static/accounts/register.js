document.getElementById("registerForm").addEventListener("submit", async function(e){
    e.preventDefault();

    let form = e.target;
    let formData = new FormData(form);

    let res = await fetch("/api/register/", {
        method: "POST",
        body: formData,
        headers: {
            "X-CSRFToken": formData.get("csrfmiddlewaretoken")
        }
    });

    let result = await res.json();
    console.log("result :", result);

    let msg = document.getElementById("msg");
    if (!msg) {
        msg = document.createElement("div");
        msg.id = "msg";
        msg.style.marginTop = "10px";
        form.appendChild(msg);
    }

    if (result.status) {
        msg.innerText = result.msg;
        msg.style.color = "lightgreen";
        setTimeout(() => {
            window.location.href = "/";
        }, 1500);
    } else {
        msg.innerText = result.errors;
        msg.style.color = "red";
    }
});
