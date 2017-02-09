//Send image to localstorage
//https://hacks.mozilla.org/2012/02/saving-images-and-files-in-localstorage/

function previewFile() {
    var preview = $('.img');
    var file = document.querySelector('input[type=file]').files[0];
    var reader = new FileReader();
    reader.addEventListener("load", function() {

        saveImage(reader.result);
    }, false);

    if (file) {
        reader.readAsDataURL(file);
    }
} //close function

var sv = 1;

function saveImage(imageFile) {

    // Save image into localStorage
    try {

        if (sv <= 3) {

            localStorage.setItem("selfie" + sv, imageFile);

            sv = sv + 1;
        } else {
            sv = 1;

        }

    } catch (e) {
        console.log("Storage failed: " + e);
    }
    getImages();
} //close function


//need logic to see if selfies exist in localStorage and if not, get default selfies
//needs to be in function so that we can reinitialise
getImages();

var imgOne;
var imgTwo;
var imgThree;

function getImages() {

    imgOne = localStorage.getItem('selfie1');
    imgTwo = localStorage.getItem('selfie2');
    imgThree = localStorage.getItem('selfie3');

    if (imgOne === null) {

        imgOne = "selfies/one.jpg";
    }

    if (imgTwo === null) {

        imgTwo = "selfies/two.jpg";
    }

    if (imgThree === null) {
        imgThree = "selfies/three.jpg";

    }




    $(".img1").attr("src", imgOne);
    $(".img2").attr("src", imgTwo);
    $(".img3").attr("src", imgThree);


    startTimer();

} //end function



$("input#speed")
    .keyup(function() {
        var value = $(this).val();
        speed = value;
        $("p").text(value);
    })
    .keyup();

var trigger = 1;
var speed = 700;

var myVar;



function startTimer() {



    myVar = setTimeout(function() {


        carousel(trigger);

        //logic control for number of images to rotate
        if (trigger === 3) {

            trigger = 1;

        } else {

            trigger = trigger + 1;
        }

        endTimer();
    }, speed);
}

function endTimer() {
    clearTimeout(myVar);
    startTimer();
}

function carousel(trigger) {

    switch (trigger) {

        case 1:

            $(".img3").attr("src", imgOne);
            $(".img1").attr("src", imgTwo);
            $(".img2").attr("src", imgThree);

            break;

        case 2:

            $(".img2").attr("src", imgOne);
            $(".img3").attr("src", imgTwo);
            $(".img1").attr("src", imgThree);

            break;

        case 3:

            $(".img1").attr("src", imgOne);
            $(".img2").attr("src", imgTwo);
            $(".img3").attr("src", imgThree);

            break;

    } //close switch



} //close function


// Wrapper around MPL-licensed http://www.nihilogic.dk/labs/binaryajax/binaryajax.js
// to support JavaScript typed arrays since binary strings are not supported in IE 10

var createBinaryFile = function(uintArray) {
    var data = new Uint8Array(uintArray);
    var file = new BinaryFile(data);
    file.getByteAt = function(iOffset) {
        return data[iOffset];
    };
    file.getBytesAt = function(iOffset, iLength) {
        var aBytes = [];
        for (var i = 0; i < iLength; i++) {
            aBytes[i] = data[iOffset + i];
        }
        return aBytes;
    };
    file.getLength = function() {
        return data.length;
    };
    return file;
}; //close createBinaryFile





$('#PhotoButton').click(function() {
    $('#PhotoPicker').trigger('click');
    return false;
});



$('#PhotoPicker').on('change', function(e) {
    e.preventDefault();

    $("div#message2").append("Picture Preview - Please Check Your Image Before Creating Step");
    if (this.files.length === 0) return;
    var imageFile = this.files[0];
    var img = new Image();
    var url = window.URL ? window.URL : window.webkitURL;
    img.src = url.createObjectURL(imageFile);

    img.onload = function(e) {
        url.revokeObjectURL(this.src);
        var width;
        var height;



        var binaryReader = new FileReader();




        binaryReader.onloadend = function(d) {



            var exif, transform = "none";
            exif = EXIF.readFromBinaryFile(createBinaryFile(d.target.result));
            if (exif.Orientation === 8) {
                width = img.height;
                height = img.width;
                transform = "left";
            } else if (exif.Orientation === 6) {
                width = img.height;
                height = img.width;
                transform = "right";
            } else if (exif.Orientation === 1) {
                width = img.width;
                height = img.height;
            } else if (exif.Orientation === 3) {
                width = img.width;
                height = img.height;
                transform = "flip";
            } else {
                width = img.width;
                height = img.height;
            }


            //we can change the width and height here

            var MAX_WIDTH = 600;
            var MAX_HEIGHT = 600;


            if (width / MAX_WIDTH > height / MAX_HEIGHT) {
                if (width > MAX_WIDTH) {
                    height *= MAX_WIDTH / width;
                    width = MAX_WIDTH;
                }
            } else {
                if (height > MAX_HEIGHT) {
                    width *= MAX_HEIGHT / height;
                    height = MAX_HEIGHT;
                }
            }


            var canvas = $('#PhotoEdit')[0];
            canvas.width = width;
            canvas.height = height;
            var ctx = canvas.getContext("2d");
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            if (transform === 'left') {
                ctx.setTransform(0, -1, 1, 0, 0, height);
                ctx.drawImage(img, 0, 0, height, width);
            } else if (transform === 'right') {
                ctx.setTransform(0, 1, -1, 0, width, 0);
                ctx.drawImage(img, 0, 0, height, width);
            } else if (transform === 'flip') {
                ctx.setTransform(1, 0, 0, -1, 0, height);
                ctx.drawImage(img, 0, 0, width, height);
            } else {
                ctx.setTransform(1, 0, 0, 1, 0, 0);
                ctx.drawImage(img, 0, 0, width, height);
            }
            ctx.setTransform(1, 0, 0, 1, 0, 0);
        };
        binaryReader.readAsArrayBuffer(imageFile);



    };
});
