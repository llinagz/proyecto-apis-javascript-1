const API_URL = 'https://api.thecatapi.com/v1/images/search?limit=2';
const API_KEY = 'api_key=live_wTIhtAowfi4F5tSAFDdngMXNL686qiRSUiTi84NLYhiUERVLqLJrRmQcp3hGqiKw'
const API_FAVORITES = 'https://api.thecatapi.com/v1/favourites'
const API_UPLOAD = 'https://api.thecatapi.com/v1/images/upload'
const API_FAVORITES_DELETE = (id) => `https://api.thecatapi.com/v1/favourites/${id}`;

const spanError = document.getElementById('randomMichisError');

async function loadRandomMichis () {
    const res = await fetch(`${API_URL}&${API_KEY}`);
    const data = await res.json();

    if (res.status != 200) 
    {
        spanError.innerHTML = "Hubo un error: " + res.status;
    }
    else
    {
        const img = document.getElementById('imagen-gatito-1');
        const img2 = document.getElementById('imagen-gatito-2');
        const btn1 = document.getElementById('btn1');
        const btn2 = document.getElementById('btn2');

        img.src = data[0].url;
        img2.src = data[1].url;

        btn1.onclick = () => saveFavoriteMichi(data[0].id)
        btn2.onclick = () => saveFavoriteMichi(data[1].id)
    }

    console.log(data);
}

async function loadFavoriteMichis () {
    const res = await fetch(API_FAVORITES,{
        method: 'GET',
        headers:{
            'X-API-KEY': 'live_wTIhtAowfi4F5tSAFDdngMXNL686qiRSUiTi84NLYhiUERVLqLJrRmQcp3hGqiKw',
        },
    });
    const data = await res.json();
    console.log('Favoritos')
    console.log(data)

    if (res.status != 200) 
    {
        spanError.innerHTML = "Hubo un error: " + res.status + data.message;
    }
    else
    {
        const toRender = [];
        const section = document.querySelector('#favoritesMichis');

        section.innerHTML = "";
        const h2 = document.createElement('h2');
        const h2Text = document.createTextNode('Michis favoritos');
        h2.appendChild(h2Text);
        section.appendChild(h2);

        data.forEach(michi => {
            const article = document.createElement('article');
            const title = document.createElement('h1');
            const img = document.createElement('img');
            const btn = document.createElement('button');
            const btnText = document.createTextNode('Sacar al michi de favoritos');
            const titleText = document.createTextNode('Gatitos favoritos');

            title.append(titleText);
            btn.append(btnText);
            img.src = michi.image.url;
            btn.onclick = () => deleteFavoriteMichi(michi.id);

            article.append(title,img,btn);
            toRender.push(article);
        });

        section.append(...toRender);
    }
}

async function saveFavoriteMichi(michiId) {
    const res = await fetch(API_FAVORITES, {
        method: 'POST',
        headers: {
        'content-type': 'application/json',
        'X-API-KEY': 'live_wTIhtAowfi4F5tSAFDdngMXNL686qiRSUiTi84NLYhiUERVLqLJrRmQcp3hGqiKw',
        },
        body: JSON.stringify({
            image_id: michiId
        }),
    });

    console.log("Save");
    console.log(res);

    if (res.status != 200) 
    {
        spanError.innerHTML = "Hubo un error: " + res.status;
    }
    else
    {
        console.log('Michi guardado en favoritos')
        loadFavoriteMichis();
    }
}

async function deleteFavoriteMichi (id){
    const res = await fetch(`${API_FAVORITES_DELETE(id)}`, {
        method: 'DELETE',
        headers:{
            'X-API-KEY': 'live_wTIhtAowfi4F5tSAFDdngMXNL686qiRSUiTi84NLYhiUERVLqLJrRmQcp3hGqiKw',
        }
    });

    if (res.status != 200) 
    {
        spanError.innerHTML = "Hubo un error: " + res.status;
    }
    else
    {
        console.log('Michi borrado de favoritos')
        loadFavoriteMichis();
    }
}

async function uploadMichiPhoto(){
    const form = document.querySelector('#uploadingForm');
    const formData = new FormData(form); //se puede enviar un argumento, nuestro formulario

    console.log(formData.get('file'));

    const res = await fetch(API_UPLOAD, {
        method: 'POST',
        headers: {
            //Content-Type': 'multipart/form-data',
            'X-API-KEY': 'live_wTIhtAowfi4F5tSAFDdngMXNL686qiRSUiTi84NLYhiUERVLqLJrRmQcp3hGqiKw'
        },
        body: formData, //Crea el el content-type, por eso lo comentamos
    })

    const data = await res.json();

    if (res.status !== 201) 
    {
        spanError.innerHTML = `Hubo un error al subir michi: ${res.status} ${data.message}`
    }
    else 
    {
        console.log("Foto de michi cargada :)");
        console.log({ data });
        console.log(data.url);
        saveFavoriteMichi(data.id) //para agregar el michi cargado a favoritos.
    }

}

loadRandomMichis();
loadFavoriteMichis();