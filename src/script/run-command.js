/* eslint-disable */
// Global variables loaded from external scripts
/* global IndexedDBFileStorage */

const run_cancel_convert = () => {
  runCancelConvert();
} 

async function run_get_info(fileUrl) {
  return new Promise(async (resolve, reject) => {
    let info = await getFileInfo(fileUrl, 'DESKTOP', true);
    resolve(info);
  });
}

async function run_Convert_File_With_Options_New(inputOptions, defaultOptions = {}){

  await convertFileWithOptions_New(
    inputOptions,
    defaultOptions,
  );

}

async function run_clear_data() {
  localStorage.removeItem('convert_settings');
  if (typeof IndexedDBFileStorage !== 'undefined') {
    const fileStorageDB = new IndexedDBFileStorage();
    await fileStorageDB.deleteAllFiles();
  } else {
    console.warn('IndexedDBFileStorage is not loaded yet. Skipping file storage cleanup.');
  }
}

function run_on_event(callback) {
  BeeUI.onEvent((name, data) => {
    callback(name, data);
  });
}


export {
  run_cancel_convert,
  run_get_info,
  run_Convert_File_With_Options_New,
  run_clear_data,
  run_on_event,
};
