$(document).ready(function () {
    console.log('tet');
    var list;
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            
            list = JSON.parse(xhttp.responseText);
            for(var i = 0; i < list.length; i++){
                if(list[i].info[0]){
                    var item = `<li class="list-group-item" value =${list[i].id} >${list[i].info[0].name} (${list[i].price}€)</li>`;
                    $('#list').append(item);
                }
                
            }

            $('#list').children().each(function(){
                $(this).on('click', function(){
                    localStorage.setItem("item",JSON.stringify(getItem($(this).val())));
                    console.log('item stored');
                    window.location.href = "http://localhost:8080/updateItem.html";
                });
               
            });


        }
    };
    xhttp.open("GET", "http://localhost:8080/GetListItems", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send();

    getItem = function(id){
        for(var i = 0; i < list.length; i++){
            if(list[i].id == id) return list[i];
        }
    }

});