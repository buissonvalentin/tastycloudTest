$(document).ready(function () {

    var descInput = `<div  class="form-row">
                        <div class="form-group col-md-10">
                            <label for="desc">Description</label>
                            <input type="text" class="form-control" id="desc" placeholder="Description du produit">
                        </div>
                        <div class="form-group col-md-2">
                            <label for="inputState">Langue</label>
                            <select id="inputState" class="form-control">
                                <option selected>FR</option>
                                <option>EN</option>
                                <option>DE</option>
                                <option>ES</option>
                                <option>NL</option>
                            </select>
                        </div>
                    </div>`;
    var nameInput = `<div class="form-row" >
                        <div class="form-group col-md-6">
                            <label for="name">Nom</label>
                            <input type="text" class="form-control" id="name" placeholder="Nom du produit">
                        </div>
                        <div class="form-group col-md-2">
                            <label for="inputState">Langue</label>
                            <select id="inputState" class="form-control">
                                <option selected>FR</option>
                                <option>EN</option>
                                <option>DE</option>
                                <option>ES</option>
                                <option>NL</option>
                            </select>
                        </div>
                    </div>`;

    var descCont = $('#descContainer');
    var nameCont = $('#nameContainer')



    console.log($('#addDesc'));

    $('#addDesc').on('click', function () {
        descCont.append(descInput);
    });
    $('#addName').on('click', function () {
        nameCont.append(nameInput);
    });


    $('#add').on('click', function () {
        var item = { name : {}, desc : {}, price : 0};
        nameCont.children().each(function(){
            //var item = { name : {}, desc : {}, price : 0};
            
            var name = $(this).find('#name').val();
            var lg = $(this).find('select option:selected').html();
            item.name[lg] = name;
        });

        descCont.children().each(function(){
            //var item = { name : {}, desc : {}, price : 0};
            
            var desc = $(this).find('#desc').val();
            var lg = $(this).find('select option:selected').html();
            item.desc[lg] = desc;
        });

        item.price = $('#price').val();
        var itemParam =  JSON.stringify(item);
        console.log(itemParam)

        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
               console.log(xhttp.responseText);
               window.location.href = "http://localhost:8080/";
            }
        };
        xhttp.open("GET", "http://localhost:8080/AddItem?item=" + itemParam, true);
        xhttp.setRequestHeader("Content-Type", "application/json");
        xhttp.send();
    });





























});