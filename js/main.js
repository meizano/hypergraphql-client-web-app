/*jslint browser: true*/
'use strict';

// Mengakses DOM 
var semantik = document.getElementById("queryForm").elements["semantik"];
var iduris = document.getElementById('iduris');
var btnProses = document.getElementById('queryData');
var hasilData = document.getElementById('hasilData');

// Menambahkan event listener untuk tombol PROSES
btnProses.addEventListener("click", prosesData());

function prosesData() {
    //Mengosongkan nilai dan menghilangkan style
    hasilData.innerHTML = '';
    hasilData.classList.remove("alert", "alert-info", "alert-warning");
    fetchData(semantik.value, iduris.value);
    hasilData.classList.add("alert", "alert-info");
};

// Obyek untuk debugging
var obyek;

// Mengambil data dari server
function fetchData(jenisSemantik, iduri) {
    var url = 'http://localhost:8080/graphql'; // URL dari server data
    var queryGraphQL = '';
    if (jenisSemantik == "person") {
        queryGraphQL = `
        {
                Person_GET(limit: 10, offset: 100) {
                    _id
                    netWorth
                    name
                    birthDate
                    birthPlace {
                        label(lang: "en")
                    }
                    deathDate
                    deathPlace {
                        label(lang: "en")
                    }
                }
            }
    `;
    } else if (jenisSemantik == "personID") {
        queryGraphQL = `
        {
            Person_GET_BY_ID(uris: ["${iduri}"]) {
              _id
              name
              birthDate
              birthPlace {
                label(lang: "en")
              }
              deathDate
              deathPlace {
                label(lang: "en")
              }
            }
          }
        `;
    } else if (jenisSemantik == "city") {
        queryGraphQL = `
        {
            City_GET(limit: 10, offset: 100) {
              _id
              leader {
                name
              }
              label(lang: "en")
              country {
                label(lang: "en")
              }
            }
          }
        `;
    }

    fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: queryGraphQL,
            }),
        })
        .then((resp) => resp.json())
        .then(function (graphQLdata) {
            // Simpan ke obyek global untuk debugging
            obyek = graphQLdata;
            // Cetak obyek data
            console.log(graphQLdata);

            if (jenisSemantik == "person") {
                // Akses langsung 1 elemen
                hasilData.innerHTML += graphQLdata.data.Person_GET[0].name;
                // Proses Data
                graphQLdata.data.Person_GET.forEach(element => { // graphQLdata.data.Person_GET[indeks]
                    console.log(element);
                    hasilData.innerHTML += "ID: " + element._id + "<br/>";
                    hasilData.innerHTML += "Nama: " + element.name + "<br/>";
                    hasilData.innerHTML += "Tanggal Lahir: " + element.birthDate + "<br/>";
                    if (element.birthPlace != null)
                        hasilData.innerHTML += "Tempat Lahir: " + element.birthPlace.label + "<br/>";
                    hasilData.innerHTML += "Tanggal Wafat: " + element.deathDate + "<br/>";
                    if (element.deathPlace != null)
                        hasilData.innerHTML += "Tempat Wafat: " + element.deathPlace.label + "<br/>";
                    hasilData.innerHTML += "<hr/>";

                });
            } else if (jenisSemantik == "personID") {
                // Proses Data
                graphQLdata.data.Person_GET_BY_ID.forEach(element => {
                    console.log(element);
                    hasilData.innerHTML += "ID: " + element._id + "<br/>";
                    hasilData.innerHTML += "Nama: " + element.name + "<br/>";
                    hasilData.innerHTML += "Tanggal Lahir: " + element.birthDate + "<br/>";
                    if (element.birthPlace != null)
                        hasilData.innerHTML += "Tempat Lahir: " + element.birthPlace.label + "<br/>";
                    hasilData.innerHTML += "Tanggal Wafat: " + element.deathDate + "<br/>";
                    if (element.deathPlace != null)
                        hasilData.innerHTML += "Tempat Wafat: " + element.deathPlace.label + "<br/>";
                    hasilData.innerHTML += "<hr/>";

                });
            } else if (jenisSemantik == "city") {
                // Proses Data
                console.log(graphQLdata);
                graphQLdata.data.City_GET.forEach(element => {
                    console.log(element);
                    hasilData.innerHTML += "ID: " + element._id + "<br/>";
                    if (element.label != null)
                        hasilData.innerHTML += "Kota: " + element.label + "<br/>";
                    if (element.country != null)
                        if (element.country.label != null)
                            hasilData.innerHTML += "Negara: " + element.country.label + "<br/>";
                    hasilData.innerHTML += "<hr/>";

                });
            }

            hasilData.classList.remove("alert", "alert-info", "alert-warning");
            hasilData.classList.add("alert", "alert-info");

        })
        .catch(function (error) {
            hasilData.innerHTML = JSON.stringify(error);
            hasilData.classList.remove("alert", "alert-info", "alert-warning");
            hasilData.classList.add("alert", "alert-warning");
        });
};