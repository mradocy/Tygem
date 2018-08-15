/// <reference path="_ref.ts" />


// eventually this will replace SaveBox.  Right now this is just for testing downloading files


namespace SaveManager {

    export let data: any = {};

    /**
     * Downloads a file containing copy of the save data.
     * Must be called from user input.
     */
    export function downloadSaveData() {

        // https://stackoverflow.com/a/33542499

        // remove url if used before
        if (saveDownloadURL != "") {
            window.URL.revokeObjectURL(saveDownloadURL);
        }
        
        // creating file to be downloaded
        let blob: Blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
        saveDownloadURL = window.URL.createObjectURL(blob);

        // instigating download
        var elem = window.document.createElement('a');
        elem.href = saveDownloadURL;
        (elem as any).download = "data.sav";
        document.body.appendChild(elem);
        elem.click();
        document.body.removeChild(elem);
        
    }
    let saveDownloadURL: string = "";

}