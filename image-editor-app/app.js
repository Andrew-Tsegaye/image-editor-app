const fileInput = document.querySelector('.file-input');
const chooseImgBtn = document.querySelector('.choose-img');
const previewImg = document.querySelector('.preview-img img');
const filterOptions = document.querySelectorAll('.filter button');
const filterName = document.querySelector('.filter-info .name');
const filterValue = document.querySelector('.filter-info .value');
const filterSlider = document.querySelector('.slider input');
const rotateOptions = document.querySelectorAll('.rotate button');
const resetFilterBtn = document.querySelector('.reset-filter');
const saveImgBtn = document.querySelector('.save-img');

let brightness = 100,
  saturation = 100,
  inversion = 0,
  grayscale = 0,
  rotate = 0,
  flipHorizontal = 1,
  flipVertical = 1;

const applyFilters = () => {
  previewImg.style.transform = `rotate(${rotate}deg) scale(${flipHorizontal}, ${flipVertical})`;
  previewImg.style.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
};

const loadImage = () => {
  resetFilter();
  let file = fileInput.files[0]; // Getting user selected file
  if (!file) return;
  previewImg.src = URL.createObjectURL(file); // passing file URL as preview image src
  previewImg.addEventListener('load', () => {
    document.querySelector('.container').classList.remove('disable');
  });
};

filterOptions.forEach(option => {
  option.addEventListener('click', () => {
    // adding a click event to all filter buttons
    document.querySelector('.filter .active').classList.remove('active');
    option.classList.add('active');
    filterName.innerText = option.innerText;

    if (option.id === 'brightness') {
      filterSlider.max = '200';
      filterSlider.value = brightness;
      filterValue.innerText = `${brightness}%`;
    } else if (option.id === 'saturation') {
      filterSlider.max = '200';
      filterSlider.value = saturation;
      filterValue.innerText = `${saturation}%`;
    } else if (option.id === 'inversion') {
      filterSlider.max = '100';
      filterSlider.value = inversion;
      filterValue.innerText = `${inversion}%`;
    } else {
      filterSlider.max = '100';
      filterSlider.value = grayscale;
      filterValue.innerText = `${grayscale}%`;
    }
  });
});

const updateFilter = function () {
  filterValue.innerText = `${filterSlider.value}%`;
  // getting selected filter button
  const selectedFilter = document.querySelector('.filter .active');

  if (selectedFilter.id === 'brightness') {
    brightness = filterSlider.value;
  } else if (selectedFilter.id === 'saturation') {
    saturation = filterSlider.value;
  } else if (selectedFilter.id === 'inversion') {
    inversion = filterSlider.value;
  } else {
    grayscale = filterSlider.value;
  }
  applyFilters();
};

rotateOptions.forEach(option => {
  // adding a click event to all rotate/filter buttons
  option.addEventListener('click', () => {
    if (option.id === 'left') {
      rotate -= 90; // if clicked btn is left rotate, decrease rotate value by 90 deg
    } else if (option.id === 'right') {
      rotate += 90; // if clicked btn is right rotate, increase rotate value by 90 deg
    } else if (option.id === 'vertical') {
      // if flipHorizontal value is 1, set this value to -1 else set 1
      flipHorizontal = flipHorizontal === 1 ? -1 : 1;
    } else {
      // if flipVertical value is 1, set this value to -1 else set 1
      flipVertical = flipVertical === 1 ? -1 : 1;
    }
    applyFilters();
  });
});

const resetFilter = () => {
  // reseting all the values of the variable to its default
  brightness = 100;
  saturation = 100;
  inversion = 0;
  grayscale = 0;
  rotate = 0;
  flipHorizontal = 1;
  flipVertical = 1;
  filterOptions[0].click(); // clicking brightness btn, so the brightness selected by defualt
  applyFilters();
};

const saveImage = () => {
  const canvas = document.createElement('canvas'); // creating canvas element
  const ctx = canvas.getContext('2d'); // canvas.getContext return a drawing context on the canvas
  canvas.width = previewImg.naturalWidth; // setting the canvas width to actual image width
  canvas.height = previewImg.naturalHeight; // setting the canvas height to actual image height

  // appliying user selected filters to canvas filter
  ctx.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
  ctx.translate(canvas.width / 2, canvas.height / 2); // translating canvas from center
  ctx.scale(flipHorizontal, flipVertical); // flip canvas, horizontally / vertically
  // if rotate value isn't 0, rotate the canvas
  if (rotate !== 0) {
    ctx.rotate((rotate * Math.PI) / 180);
  }
  ctx.drawImage(
    previewImg,
    -canvas.width / 2,
    -canvas.height / 2,
    canvas.width,
    canvas.height
  );

  const link = document.createElement('a'); // creating <a> element
  link.download = 'image.jpg'; // passing <a> tag download value to "image.jpg"
  link.href = canvas.toDataURL(); // passing <a> tag href value to canvas data url
  link.click(); // clicking <a> tag so the image will be downloaded
};

fileInput.addEventListener('change', loadImage);
filterSlider.addEventListener('input', updateFilter);
resetFilterBtn.addEventListener('click', resetFilter);
saveImgBtn.addEventListener('click', saveImage);
chooseImgBtn.addEventListener('click', () => fileInput.click());
