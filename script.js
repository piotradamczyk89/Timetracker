const apikey = '077ea9bf-d637-402f-be3e-ea5585b47bb6';
const apihost = 'https://todo-api.coderslab.pl';



document.addEventListener('DOMContentLoaded', function() {

    function apiListTasks() {
        return fetch(
            apihost + '/api/tasks',
            {
                headers: { Authorization: apikey }
            }
        ).then(resp => {
                if(!resp.ok) {
                    alert('Wystąpił błąd! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny');
                }
                return resp.json();
            }
        )
    }

    function apiListOperationsForTask(taskId) {
        return fetch(`https://todo-api.coderslab.pl/api/tasks/${taskId}/operations`,
            {
                headers: { Authorization: apikey }
        }).then(resp => {
                if(!resp.ok) {
                    alert('Wystąpił błąd! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny');
                }
                return resp.json();
            }
        );
    }

    function apiCreateTask(title, description) {
        return fetch(
            apihost + '/api/tasks',
            {
                headers: { Authorization: apikey, 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: title, description: description, status: 'open' }),
                method: 'POST'
            }
        ).then(
            function(resp) {
                if(!resp.ok) {
                    alert('Wystąpił błąd! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny');
                }
                return resp.json();
            }
        )
    }

    function apiDeleteTask(taskId) {
        return fetch(`https://todo-api.coderslab.pl/api/tasks/${taskId}`,
            {
                headers: { Authorization: apikey },
                method: 'DELETE'
        }).then(
            function(resp) {
                if(!resp.ok) {
                    alert('Wystąpił błąd! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny');
                }
                return resp.json();
            }
        )

    }

    function apiCreateOperationForTask(taskId, description) {
        return fetch(`https://todo-api.coderslab.pl/api/tasks/${taskId}/operations`,
            {
                headers: { Authorization: apikey, 'Content-Type': 'application/json' },
                body: JSON.stringify({ description: description, timeSpent: 0 }),
                method: 'POST'
            }).then(
            function(resp) {
                if(!resp.ok) {
                    alert('Wystąpił błąd! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny');
                }
                return resp.json();
            }
        )
    }

    function apiUpdateOperation(operationId, description, timeSpent) {
        return fetch(`https://todo-api.coderslab.pl/api/operations/${operationId}`,
            {
                headers: { Authorization: apikey, 'Content-Type': 'application/json' },
                body: JSON.stringify({ description: description, timeSpent: timeSpent }),
                method: 'PUT'
            }).then(
            function(resp) {
                if(!resp.ok) {
                    alert('Wystąpił błąd! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny');
                }
                return resp.json();
            }
        )
    }

    function apiDeleteOperation(operationId) {
        return fetch(`https://todo-api.coderslab.pl/api/operations/${operationId}`,
            {
                headers: { Authorization: apikey },
                method: 'DELETE'
            }).then(
            function(resp) {
                if(!resp.ok) {
                    alert('Wystąpił błąd! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny');
                }
                return resp.json();
            }
        )
    }

    function apiUpdateTask(taskId, title, description, status) {
        return fetch(`https://todo-api.coderslab.pl/api/tasks/${taskId}`,
            {
                headers: { Authorization: apikey, 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: title, description: description, status: status }),
                method: 'PUT'
            }).then(
            function(resp) {
                if(!resp.ok) {
                    alert('Wystąpił błąd! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny');
                }
                return resp.json();
            }
        )
    }

    function renderTask(taskId, title, description, status) {
        const section = document.createElement("section");
        // section.innerText = 'Tytuł: ' + title + ', opis: ' + description + ', status: ' + status;
        section.className = 'card mt-5 shadow-sm';
        document.querySelector('main').appendChild(section);

        const headerDiv = document.createElement('div');
        headerDiv.className = 'card-header d-flex justify-content-between align-items-center';
        section.appendChild(headerDiv);

        const headerLeftDiv = document.createElement('div');
        headerDiv.appendChild(headerLeftDiv);

        const h5 = document.createElement('h5');
        h5.innerText = title;
        headerLeftDiv.appendChild(h5);


        const h6 = document.createElement('h6');
        h6.className = 'card-subtitle text-muted';
        h6.innerText = description;
        headerLeftDiv.appendChild(h6);

        const headerRightDiv = document.createElement('div');
        headerDiv.appendChild(headerRightDiv);

        if(status == 'open') {
            const finishButton = document.createElement('button');
            finishButton.className = 'btn btn-dark btn-sm js-task-open-only';
            finishButton.innerText = 'Finish';
            headerRightDiv.appendChild(finishButton);

            finishButton.addEventListener("click",function (){
                status="close";
                apiUpdateTask(taskId,title,description,status);
                let toDelete = document.querySelectorAll(".js-task-open-only")
                toDelete.forEach(function (el){
                   el.parentElement.removeChild(el);
                });
            })
        }

        const deleteButton = document.createElement('button');
        deleteButton.className = 'btn btn-outline-danger btn-sm ml-2';
        deleteButton.innerText = 'Delete';
        headerRightDiv.appendChild(deleteButton);


        deleteButton.addEventListener("click",function () {
            apiDeleteTask(taskId);
            document.querySelector('main').removeChild(section);
            });

        const listOfSubbTasks = document.createElement("ul");
        listOfSubbTasks.className="list-group list-group-flush";
        section.appendChild(listOfSubbTasks);

        apiListOperationsForTask(taskId).then(resp => {
            console.log(resp.data)
            resp.data.forEach(function (el){
                renderOperation(listOfSubbTasks,status,el.id,el.description,el.timeSpent);
            })
        })



        const headerForm = document.createElement("div");
        headerForm.className="card-body";
        section.appendChild(headerForm)

        const form = document.createElement("form");
        headerForm.appendChild(form);

        const divInsideForm = document.createElement("div");
        divInsideForm.className="input-group";
        form.appendChild(divInsideForm);

        const inputForm = document.createElement("input");
        inputForm.className="form-control";
        inputForm.type="txt";
        inputForm.placeholder="Operation Description";
        inputForm.minLength=5;
        divInsideForm.appendChild(inputForm);

        const divForInputButton = document.createElement("div");
        divForInputButton.className="input-group-append";
        divInsideForm.appendChild(divForInputButton);

        const buttonForAddingDescription = document.createElement("button");
        buttonForAddingDescription.className="btn btn-info";
        buttonForAddingDescription.innerText="Add";
        divForInputButton.appendChild(buttonForAddingDescription);

        form.addEventListener("submit", function (event) {
            event.preventDefault();
            if (inputForm.value!="") {
                apiCreateOperationForTask(taskId,inputForm.value).then(resp => {
                    renderOperation(listOfSubbTasks,status,resp.data.id,resp.data.description,resp.data.timeSpent);
                })
                inputForm.value="";
            }

        })

    }

    function renderOperation(operationsList, status, operationId, operationDescription, timeSpent) {
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center';
        // operationsList to lista <ul>

        operationsList.appendChild(li);


        const descriptionDiv = document.createElement('div');
        descriptionDiv.innerText = operationDescription;
        li.appendChild(descriptionDiv);


        const time = document.createElement('span');
        time.className = 'badge badge-success badge-pill ml-2';
        let hourTime = Math.floor(timeSpent/60)
        let minuteTime =timeSpent%60;
        if (minuteTime!=0 && hourTime!=0) {
            time.innerText = hourTime+ 'h' + minuteTime + "m";
        } else if ( hourTime==0 ){
            time.innerText = minuteTime+ 'm'
        } else if (minuteTime==0 && hourTime!=0) {
            time.innerText = hourTime+ 'h'
        }
        descriptionDiv.appendChild(time);


        if(status == "open") {

            const divForButtonTime = document.createElement("div");
            li.appendChild(divForButtonTime);

            const button15min= document.createElement("button");
            button15min.className="btn btn-outline-success btn-sm mr-2 js-task-open-only";
            button15min.innerText="+15m";
            divForButtonTime.appendChild(button15min);


            button15min.addEventListener("click", function (){
                apiUpdateOperation(operationId,operationDescription,timeSpent+15).then(resp => {
                    timeSpent+=15;
                    let hourTime = Math.floor(resp.data.timeSpent/60)
                    let minuteTime =resp.data.timeSpent%60;
                    if (minuteTime!=0 && hourTime!=0) {
                        time.innerText = hourTime+ 'h' + minuteTime + "m";
                    } else if ( hourTime==0 ){
                        time.innerText = minuteTime+ 'm'
                    } else if (minuteTime==0 && hourTime!=0) {
                        time.innerText = hourTime+ 'h'
                    }
                })
            })

            const button1h= document.createElement("button");
            button1h.className="btn btn-outline-success btn-sm mr-2 js-task-open-only";
            button1h.innerText="+1h";
            divForButtonTime.appendChild(button1h);

            button1h.addEventListener("click", function (){
                apiUpdateOperation(operationId,operationDescription,timeSpent+60).then(resp => {
                    timeSpent+=60;
                    let hourTime = Math.floor(resp.data.timeSpent/60)
                    let minuteTime =resp.data.timeSpent%60;
                    if (minuteTime!=0 && hourTime!=0) {
                        time.innerText = hourTime+ 'h' + minuteTime + "m";
                    } else if ( hourTime==0 ){
                        time.innerText = minuteTime+ 'm'
                    } else if (minuteTime==0 && hourTime!=0) {
                        time.innerText = hourTime+ 'h'
                    }
                })
            })

            const buttonDelete= document.createElement("button");
            buttonDelete.className="btn btn-outline-danger btn-sm js-task-open-only";
            buttonDelete.innerText="Delete";
            divForButtonTime.appendChild(buttonDelete);

            buttonDelete.addEventListener("click",function (){
                apiDeleteOperation(operationId)
                operationsList.removeChild(li);
            })

        }


    }

    apiListTasks().then(response => {
            response.data.forEach( function(task) {
                renderTask(task.id, task.title, task.description, task.status);
            }
            );
        }
    );

    let formToAddTask = document.querySelector(".js-task-adding-form");
    let inputTaskAtributes = formToAddTask.querySelectorAll("input");

    formToAddTask.addEventListener("submit",function (event){
        event.preventDefault();

        if(inputTaskAtributes[0].value!="" && inputTaskAtributes[1].value!="") {
            apiCreateTask(inputTaskAtributes[0].value,inputTaskAtributes[1].value).then(resp => {
                renderTask(resp.data.id,resp.data.title,resp.data.description,resp.data.status)
                }
            )
            inputTaskAtributes[0].value="";
            inputTaskAtributes[1].value="";
        }




    })



});
