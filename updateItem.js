$(document).ready(function () {

    var item = localStorage.getItem("item");
    item = JSON.parse(item);
    console.log(item);

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

    // var item = {id : -1, name : {}, desc : {}, price : 0};
    // item = JSON.parse('{"name":{"FR":"pain"},"desc":{"FR":"dupain"},"price":"5"}');
    // item.id = 5;

    

    $('#price').attr("value",item.price);

    $('#add').on('click', function () {
        var mitem = { name : {}, desc : {}, price : 0};
        nameCont.children().each(function(){
            //var item = { name : {}, desc : {}, price : 0};
            
            var name = $(this).find('#name').val();
            var lg = $(this).find('select option:selected').html();
            mitem.name[lg] = name;
        });

        descCont.children().each(function(){
            //var item = { name : {}, desc : {}, price : 0};
            
            var desc = $(this).find('#desc').val();
            var lg = $(this).find('select option:selected').html();
            mitem.desc[lg] = desc;
        });

        mitem.price = $('#price').val();
        mitem.id = item.id;
        var itemParam =  JSON.stringify(mitem);

        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
               console.log(xhttp.responseText);
               window.location.href = "http://localhost:8080/";
            }
        };
        xhttp.open("GET", "http://localhost:8080/ModifyItem?item=" + itemParam, true);
        xhttp.setRequestHeader("Content-Type", "application/json");
        xhttp.send(itemParam);
    });


    $('#addDesc').on('click', function () {
        descCont.append(descInput);
    });
    $('#addName').on('click', function () {
        nameCont.append(nameInput);
    });


    addNameInput = function(name, lg){
        var nameInput = `<div class="form-row" >
                            <div class="form-group col-md-6">
                                <label for="name">Nom</label>
                                <input type="text" class="form-control" id="name" placeholder="Nom du produit" value="` + name +`">
                            </div>
                            <div class="form-group col-md-2">
                                <label for="inputState">Langue</label>
                                <select id="inputState" class="form-control">
                                    <option` + ((lg == 'FR') ? ' selected' : '') + `>FR</option>
                                    <option` + ((lg == 'EN') ? ' selected' : '') + `>EN</option>
                                    <option` + ((lg == 'DE') ? ' selected' : '') + `>DE</option>
                                    <option` + ((lg == 'ES') ? ' selected' : '') + `>ES</option>
                                    <option` + ((lg == 'NL') ? ' selected' : '') + `>NL</option>
                                </select>
                            </div>
                        </div>`;
        nameCont.append(nameInput);
    }

    addDescInput = function(desc, lg){
        var descInput = `<div  class="form-row">
                            <div class="form-group col-md-10">
                                <label for="desc">Description</label>
                                <input type="text" class="form-control" id="desc" placeholder="Description du produit" value="` + desc + `">
                            </div>
                            <div class="form-group col-md-2">
                                <label for="inputState">Langue</label>
                                <select id="inputState" class="form-control">
                                <option` + ((lg == 'FR') ? ' selected' : '') + `>FR</option>
                                <option` + ((lg == 'EN') ? ' selected' : '') + `>EN</option>
                                <option` + ((lg == 'DE') ? ' selected' : '') + `>DE</option>
                                <option` + ((lg == 'ES') ? ' selected' : '') + `>ES</option>
                                <option` + ((lg == 'NL') ? ' selected' : '') + `>NL</option>
                                </select>
                            </div>
                        </div>`;
       
        descCont.append(descInput);
    }


    for(var i = 0; i < item.info.length; i++){
        if(item.info[i].name) addNameInput(item.info[i].name, item.info[i].lg);
        if(item.info[i].description) addDescInput(item.info[i].description, item.info[i].lg);
    }





});