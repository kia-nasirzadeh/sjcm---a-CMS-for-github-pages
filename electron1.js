var finalJSON = [];
var oldFinalJson = [];
var undo1 = [];
var undo2 = [];
var undo3 = [];
var undo4 = [];
var undo5 = [];
var undo6 = [];
var undo7 = [];
var undo8 = [];
var undo9 = [];
var lastCreatedNum = null;
var directory_separator;
let undoCounter = 0;
var confHide = 'grid';
const tempPath = app.getPath('temp');
var sortingArr = [];
var tempsArr = [];
var folderToSaveJson = '';
var folderTogetContents = '';
var postFolderPath = '';
var dataFolderPath = '';
var jsonDbName = '';
var username = '';
var new_manifest;
var namingContract = new Map();
var fileAttrs = new Map();
var e = {
    delete: '<e>unsuccessful <br/><a class="helpShellLinks" href="#">see help about this issue</a></e>',
    noFileCreated: '<e>json file is empty or hasn\'t set<br/><a class="helpShellLinks" href="#">see help about this issue</a></e>',
    refresh: '<e>unsuccessful <br/><a class="helpShellLinks" href="#">see help about this issue</a></e>',
    resort: '<e>unsuccessful <br/><a class="helpShellLinks" href="#">see help about this issue</a></e>',
    undo: '<e>unsuccessful <br/><a class="helpShellLinks" href="#">see help about this issue</a></e>',
    redo: '<e>unsuccessful <br/><a class="helpShellLinks" href="#">see help about this issue</a></e>',
    rightSide: '<e>unsuccessful <br/><a class="helpShellLinks" href="#">see help about this issue</a></e>',
    noJson: '<e>no json file found <br/><a class="helpShellLinks" href="#">see help about this issue</a></e>',
    emptyJson: '<e>json file is empty<br/><a class="helpShellLinks" href="#">see help about this issue</a></e>',
}
namingContract.set('starting and ending indicator', '!@#$');
namingContract.set('separating indicator', '&!%#&');
namingContract.set('fileAttrs', ['sort_num', 'type', 'group']);
$(document).on('paste', '[contenteditable]', function (e) {
    e.preventDefault();

    if (window.clipboardData) {
        content = window.clipboardData.getData('Text');
        if (window.getSelection) {
            var selObj = window.getSelection();
            var selRange = selObj.getRangeAt(0);
            selRange.deleteContents();
            selRange.insertNode(document.createTextNode(content));
        }
    } else if (e.originalEvent.clipboardData) {
        content = (e.originalEvent || e).clipboardData.getData('text/plain');
        document.execCommand('insertText', false, content);
    }
});
var json = {
    path: function () {
        let a = path.join(folderToSaveJson, jsonDbName + '.json');
        return a;
    },
    exists: function () {
        if (fs.existsSync(this.path())) return true;
        else return false
    },
    return: function (sortnum = false, auto = false) {
        try {
            let a = fs.readFileSync(this.path()).toString();
            a = JSON.parse(a);
            if (!sortnum) return a;
            let toReturn = null;
            a.forEach(function (v, i) {
                if (v.sort_num == sortnum) toReturn = v;
            });
            return toReturn;
        } catch (e) {
            // console.log(e);
            if (auto) {
                autoCommand.add('🖵 try to return the content of json file', window.e.noJson);
                autoCommand.run();
            }
            return false;
        }
    },
    make: function () {
        if (this.exists() && this.return()) window.finalJSON = this.return();
    },
    write: function () {
        fs.writeFileSync(this.path(), JSON.stringify(finalJSON));
    },
    sort: function (pointSort_num, sortingArr) {
        let totalLength = finalJSON.length;
        if (totalLength == 0) {
            autoCommand.add('🖵 try to sort', window.e.emptyJson);
            autoCommand.run();
            return;
        }
        sortingArr.forEach(function (v, i) {
            sorter2(pointSort_num, Number(v) + Number(i));
        });
        sortingArr = [];
    },
    createDefaults: {
        type: 'text',
        group: 'para',
        format: 'text',
        color: 'black',
        content: ''
    },
    add: function (sortnum = 0, color = this.createDefaults.color, type = this.createDefaults.type, group = this.createDefaults.group, format = this.createDefaults.format, content = this.createDefaults.content) {
        let json = this.return();
        if (!json) {
            json = [];
        }
        let newItem = {
            "sort_num": sortnum,
            "color": color,
            "type": type,
            "group": group,
            "format": format,
            "content": content
        };
        json.push(newItem);
        finalJSON = json;
        this.write();
    },
    resort: function () {
        finalJSON.sort(function (a, b) {
            return a.sort_num - b.sort_num
        });
        this.write();
    }
}
// TODO: !@#$type=yext&!%#&group=header&!%#&sort_num=4!@#$ - Copy.txt ====> returns " - Copy.txt" as format!!
function array_move(arr, old_index, new_index) {
    if (new_index >= arr.length) {
        var k = new_index - arr.length + 1;
        while (k--) {
            arr.push(undefined);
        }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    return arr; // for testing
    // console.log(arr.length);
};

function OLDalwaysBottom() {
    console.log('jjj');
}

function OLDbuildFileFromSingleJson(json) {
    try {
        let extremesInd = namingContract.get('starting and ending indicator');
        let sepInd = namingContract.get('separating indicator');
        let attrsArray = namingContract.get('fileAttrs');
        finalFileName = '';
        finalFileName += extremesInd;
        attrsArray.forEach(function (v, i) {
            if (json[v] != undefined) {
                finalFileName += v + '=' + json[v] + sepInd;
            }
        });
        finalFileName = finalFileName.replace(new RegExp(sepInd + '$'), "");
        finalFileName += extremesInd + '.' + json['format'];
        let writingPath = folderTogetContents + '/' + finalFileName;
        fs.writeFileSync(writingPath, json['content']);
    } catch (e) {
        alert('error in buildFileFromSingleJson');
    }
}

function OLDconfigManifest(backedOBJ) {
    let local_jsonDbName;
    let local_folderToSaveJson;
    let local_folderTogetContents;
    try {
        local_jsonDbName = backedOBJ[0];
        if (local_jsonDbName == '') return 'json file name can\'t be empty';
    } catch (e) {
        return 'something is wrong with the json file name that you entered';
    }
    try {
        let tempOBJ = dialog.showOpenDialogSync({
            properties: ['openDirectory'],
            title: 'choose your desired folder to save your json file in',
            buttonLabel: 'choose as json folder'
        });
        if (tempOBJ == undefined) {
            return 'please choose a folder to save your json file (e.g. your jekyll _data folder)';
        }
        local_folderToSaveJson = tempOBJ[0];
        local_folderToSaveJson = local_folderToSaveJson.replace(/\\/g, "/");
    } catch (e) {
        return 'something is wrong with the directory that you entered';
    }
    try {
        let tempOBJ = dialog.showOpenDialogSync({
            properties: ['openDirectory'],
            title: 'choose a folder to save contents',
            buttonLabel: 'choose as contents folder'
        });
        if (folderTogetContents == undefined || folderTogetContents == '') {
            if (tempOBJ == undefined) {
                return 'please choose a folder to get Contents From: (and also make json from):';
            }
            local_folderTogetContents = tempOBJ[0];
        } else {
            local_folderTogetContents = folderTogetContents;
        }
        local_folderTogetContents = local_folderTogetContents.replace(/\\/g, "/");


    } catch (e) {
        return 'something is wrong with the directory that you entered';
    }
    new_manifest = `{\n"folderToSaveJson": "${local_folderToSaveJson}",\n"folderTogetContents": "${local_folderTogetContents}",\n"jsonDbName": "${local_jsonDbName}"\n}`;
    return '<span>it\'s done but do not forget that making changes in manifest won\'t take effect unless reload it again<br>use: <span class="cmd-in-cmd">config manifest -reload</span></span>'
}

function configManifest_reload() {
    if (new_manifest != '' && new_manifest != undefined) {
        fs.writeFileSync("user-manifest.json", new_manifest);
    } else {
        alert('it is strongly recommended to first config your manifest file');
        return 'no manifest file found to reload';
    }
    try {
        setupManifest();
        showItems();
        return 'it\'s done';
    } catch (e) {
        alert('Error in configManifest_reload function');
        alert(e);
        return 'something is wrong ERR_2';
    }
}

function OLDconfigManifest_open() {
    let appPath = app.getAppPath();
    appPath = path.join(appPath, 'user-manifest.json');
    shell.openItem(appPath);
    return '<span>do not forget that making changes in manifest won\'t take effect unless reload it again<br>use: <span class="cmd-in-cmd">config manifest -reload</span></span>'
}

function changeGrpName(sortnum, newGrp, deleteBoolean = false) {
    try {
        syncUndo();
        finalJSON.forEach(function (v, i) {
            if (v.sort_num == sortnum) {
                v.group = newGrp;
            }
        });
        json.write();
        showItems();
        if (deleteBoolean) deleteBySortNum(sortnum);
    } catch (e) {
        console.log('error in changeGrpName');
    }
}

function changeTypeName(sortnum, newType, deleteBoolean = false) {
    try {
        syncUndo();
        finalJSON.forEach(function (v, i) {
            if (v.sort_num == sortnum) {
                v.type = newType;
            }
        });
        json.write();
        showItems();
        if (deleteBoolean) deleteBySortNum(sortnum);
    } catch (e) {
        console.log('error in changeGrpName');
    }
}

function changeRightPage(pageId, auto = true) {
    try {
        $('.main-c-right > div:not(:first-child)').css('z-index', '9');
        $(pageId).css('z-index', '11');
        if (pageId == '#shell') focusTo();
        if (pageId == '#settings') datafunc();
        if (auto) {
            autoCommand.add(`🖵 changing right side to ${pageId.replace('#', '')}`, 'done');
            autoCommand.run();
        }
    } catch (e) {
        if (auto) {
            autoCommand.add('🖵 changing right side', e.rightSide);
            autoCommand.run();
        }
    }
}

function copy(sortnum) {
    try {
        syncUndo();
        let firstLength = finalJSON.length;
        finalJSON.forEach(function (v, i) {
            if (sortnum == v.sort_num) {
                create(['', v.type, v.group, v.format]);
                finalJSON[finalJSON.length - 1].content = v.content;
            }
        });
        json.write();
        showItems();
        if (finalJSON.length != firstLength) return true;
        if (finalJSON.length == firstLength) return false;
    } catch (e) {
        alert('error in copy');
    }
}

function copyAfter(sortnum, fromMenu = false) {
    syncUndo();
    copy(sortnum);
    // console.log(tempsArr);
    // console.log(tempsArr);
    let lastNum = getLastNum();
    // console.log('lastNum');
    // console.log(lastNum);
    // // console.log(sortnum);
    let point = Number(sortnum) + 1;
    let comer = Number(lastNum);

    let btw_sortnums = [];
    for (let i = point; i < comer; i++) {
        btw_sortnums.push(i);
    }
    btw_sortnums.forEach(function (vv, ii) {
        let pointExists = false;
        finalJSON.forEach(function (v, i) {
            if (v.sort_num == vv) pointExists = true;
        });
        if (pointExists == false) {
            create([vv, 'tmp', 'tmp', 'txt']);
            tempsArr.push(vv);
        }
    });
    json.sort(Number(sortnum) + 1, [Number(lastNum)]);
    showItems();
    if (fromMenu == false) sortingArr = [];
    pointSort_num = undefined;
    emptyTempsArray();
}

function create(backedOBJ, autoCommand = false) {
    try {
        syncUndo();
        let sortNumUser = backedOBJ[0];
        let sortNum;
        let type = backedOBJ[1];
        let group = backedOBJ[2];
        let format = backedOBJ[3];
        if (type == '') type = 'text';
        if (group == '') group = 'para';
        if (format == '') format = 'txt';
        let sortNumSystem = getLastNum() + 1;
        if (type == 'conf' && group == 'conf') {
            json.add(sortNum = 0, 'darkred', 'conf', 'conf', '.json', '{}');
            json.resort();
            showItems();
            datafunc();
        } else if (sortNumSystem == '-Infinity' && sortNumUser == '') { //no user sortnum and no any other item
            sortNum = 1;
            json.add(sortNum, 'black', type, group, format, '');
            lastCreatedNum = sortNum;
            showItems();
            return 'the file was created successfully';
        } else if (sortNumSystem != '-Infinity') { //user has a sortnum
            if (sortNumUser != '') sortNum = sortNumUser;
            else sortNum = sortNumSystem;
            json.add(sortNumSystem, 'black', type, group, format, '');
            if (sortNumUser != '') {
                json.sort(sortNumUser, [sortNumSystem]);
                lastCreatedNum = sortNumUser;
            } else {
                lastCreatedNum = sortNumSystem;
            }
            showItems();
            return 'the file was created successfully';
        }
        console.log('sortNumSystem:', sortNumSystem);
        console.log('sortNumUser:', sortNumUser)
        // if (type == 'conf' && group == 'conf') fs.writeFileSync(folderTogetContents + '/' + filename , '{}');
        // else json.write();
        // showItems();
    } catch (e) {
        console.log(e);
        return;
        return 'something is wrong ERR3';
    }
}

function OLDcreate(backedOBJ, autoCommand = false) {
    try {
        syncUndo();
        let sortNumUser = backedOBJ[0];
        let sortNum;
        let type = backedOBJ[1];
        let group = backedOBJ[2];
        let format = backedOBJ[3];
        if (type == '') type = 'text';
        if (group == '') group = 'paragraph';
        if (format == '') format = 'txt';
        let sortNumSystem = getLastNum() + 1;
        if (sortNumSystem == '-Infinity' && sortNumUser == '') {
            sortNum = 1;
        } else if (sortNumSystem == '-Infinity' && sortNumUser != '') {
            sortNum = sortNumUser;
        } else {
            sortNum = sortNumSystem;
        }
        if (folderTogetContents == '' || folderTogetContents == undefined) {
            return 'your manifest file has not some of the information that we need -> folderTogetContents';
        }
        let folderToCreateContentsThere = folderTogetContents.replace('/', '/');
        let filename = `!@#$sort_num=${sortNum}&!%#&type=${type}&!%#&group=${group}!@#$.${format}`;
        if (type == 'conf' && group == 'conf') fs.writeFileSync(folderTogetContents + '/' + filename, '{}');
        else fs.writeFileSync(folderTogetContents + '/' + filename, '');
        refresh();
        let sortPERM = true;
        finalJSON.some(function (v) {
            if (v.sort_num != sortNumUser) {
                sortPERM = false;
            } else {
                sortPERM = 'permed';
                return true;
            }
        });
        if (sortNumSystem != '-Infinity' && sortNumUser != '' && sortPERM == false) {
            fs.unlinkSync(folderTogetContents + '/' + filename);
            filename = `!@#$sort_num=${sortNumUser}&!%#&type=${type}&!%#&group=${group}!@#$.${format}`;
            fs.writeFileSync(folderTogetContents + '/' + filename, '');
            refresh();
            return 'the file was created successfully';
        } else if (sortNumSystem != '-Infinity' && sortNumUser != '') {
            sorter1(sortNumUser, [sortNumSystem]);
            refresh();
            return 'the file was created successfully';
        } else if (sortNumSystem != '-Infinity' && sortNumUser != '' && sortPERM == 'permed') {
            sorter1(sortNumUser, [sortNumSystem]);
            refresh();
            return 'the file was created successfully';
        }
        return 'the file was created successfully';
    } catch (e) {
        return e;
        return 'something is wrong ERR3';
    }
}

function OLDcreateTempFolderIfnot() {
    try {
        let tempDir = path.join(tempPath, 'sjcm-user-contents');
        if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);
    } catch (e) {
        alert('error in createTempFolderIfnot');
    }
}

function choosePostPath() {
    let postFolderPathArr = dialog.showOpenDialogSync({
        title: '',
        properties: ['openDirectory'],
        buttonLabel: 'choose this as _posts folder'
    });
    postFolderPath = postFolderPathArr[0];
    datafunc();
}

function confExists() {
    let toReturn = false;
    finalJSON.forEach(function (v, i) {
        if (v.type == 'conf' && v.group == 'conf') {
            toReturn = true;
        }
    });
    return toReturn;
}

function OLDdeleteBySortNumCertificated(sortnum, auto = false) {
    try {
        syncUndo();
        let userOK = dialog.showMessageBoxSync({
            'type': 'warning',
            buttons: ['Cancel', 'OK'],
            'message': 'are you sure?'
        });
        if (userOK == 0) return false;
        let firstLength = finalJSON.length;
        finalJSON.forEach(function (v, i) {
            if (sortnum == v.sort_num) {
                fs.unlinkSync(v.path);
                finalJSON = _.differenceWith(finalJSON, [v], _.isEqual);
            }
        });
        if (finalJSON.length == firstLength - 1) {
            autoCommand.add('🖵 tried to delete an item', 'successful');
            autoCommand.run();
            refresh();
            return true;
        } else {
            autoCommand.add('🖵 tried to delete an item', e.delete);
            autoCommand.run();
            refresh();
            return false;
        }
        sortingArr = [];
    } catch (e) {
        return 'error in deleteBySortNum';
    }
}

function deleteBySortNumCertificated(sortnum, auto = false) {
    try {
        syncUndo();
        let itsConf = false;
        let userOK = dialog.showMessageBoxSync({
            'type': 'warning',
            buttons: ['Cancel', 'OK'],
            'message': 'am i sure?'
        });
        if (userOK == 0) return false;
        let firstLength = finalJSON.length;
        finalJSON.forEach(function (v, i) {
            if (sortnum == v.sort_num) {
                if (v.type == 'conf' && v.group == 'conf') itsConf = true;
                finalJSON.splice(i, 1);
            }
        });
        json.write();
        if (finalJSON.length == firstLength - 1) {
            autoCommand.add('🖵 tried to delete an item', 'successful');
            autoCommand.run();
            showItems();
            if (itsConf) datafunc();
            return true;
        } else {
            autoCommand.add('🖵 tried to delete an item', e.delete);
            autoCommand.run();
            return false;
        }
    } catch (e) {
        return 'error in deleteBySortNum';
    }
}

function deleteBySortNum(sortnum, syncUndoPerm = true) {
    try {
        // if (syncUndoPerm) syncUndo();
        let firstLength = finalJSON.length;
        finalJSON.forEach(function (v, i) {
            if (sortnum == v.sort_num) {
                finalJSON = _.differenceWith(finalJSON, [v], _.isEqual);
            }
        });
        fs.writeFileSync(json.path(), JSON.stringify(finalJSON));
        showItems();
        sortingArr = [];
        if (finalJSON.length != firstLength) return true;
        if (finalJSON.length == firstLength) return false;
    } catch (e) {
        console.log(e);
        return 'error in deleteBySortNum';
    }
}

function OLDdeleteByGrp(grp) {
    try {
        syncUndo();
        let firstLength = finalJSON.length;
        finalJSON.forEach(function (v, i) {
            if (grp == v.group) {
                fs.unlinkSync(v.path);
                finalJSON = _.differenceWith(finalJSON, [v], _.isEqual);
            }
        });
        refresh();
        if (finalJSON.length != firstLength) return true;
        if (finalJSON.length == firstLength) return false;
        sortingArr = [];
    } catch (e) {
        return 'error in deleteByGrp';
    }
}

function OLDdeleteAll() {
    finalJSON.forEach(function (v, i) {
        deleteBySortNum(v.sort_num, false);
    });
}

function DeletePost() {
    fs.unlinkSync(postExists());
    datafunc();
}

function datafunc() {
    let funcs = [...$('*[data-func]')];
    funcs.forEach(function (v, i) {
        let func = v.dataset.func;
        eval(func);
    });
}

function emptyTempsArray() {
    let toRemove = [];
    finalJSON.forEach(function (v, i) {
        if (v.group == 'tmp' && v.type == 'tmp') {
            toRemove.push(v.sort_num);
        }
    });
    toRemove.forEach(function (v, i) {
        deleteBySortNum(v);
    });
}

function focusTo() {
    $('.prompt-command-class').focus();
}

function OLDgetContent(elem, path) {
    try {
        let content = fs.readFileSync(path, 'utf8');
        $(elem).html(content);
        return content;
    } catch (e) {
        alert('error in getContent');
    }
}

function getLastNum() {
    let files = json.return();
    if (!files) return 0;
    let sortNumsArray = [];
    files.forEach(function (v, i) {
        sortNumsArray.push(v.sort_num);
    });
    return Math.max(...sortNumsArray);
}

function giveEvents1() {
    $('.label1 > input[type="checkbox"]').change(function () {
        const itemWidth = $(this).parents('.item-c').width();
        if ($(this).is(':checked')) {
            sortingArr.push($(this).parents('.label1').attr('data-ForSort1'));
            $(this).parents('.item-c').css('width', itemWidth * 0.94);
        } else {
            $(this).parents('.item-c').css('width', itemWidth / 0.94);
            let numToRemove = $(this).parents('.label1').attr('data-ForSort1');
            for (let i = 0; i < sortingArr.length; i++) {
                if (sortingArr[i] == numToRemove) {
                    sortingArr.splice(i, 1);
                }
            }
        }
        let oldval = $('.item-op-1').css('border');
        $('#menu').find('#openExtLink').removeClass('btn');
        $('#menu').find('#openExtLink').addClass('btn-deactive2');
        if (sortingArr.length != 0) {
            $('.item-op-1').addClass('tempClass1');
            $('.item-op-1').hover(function () {
                $(this).css('border', '1px solid dodgerblue');
                $(this).css('cursor', 'pointer');
            }, function () {
                $(this).css('border', oldval);
                $(this).css('cursor', 'default');
            });
            changeRightPage('#menu');
            if (sortingArr.length == 1) {
                $('#menu').find('#openExtLink').removeClass('btn-deactive2');
                $('#menu').find('#openExtLink').addClass('btn');
            }
        } else {
            $('.item-op-1').removeClass('tempClass1');
            $(".item-op-1").unbind('mouseenter mouseleave');
            changeRightPage('#shell');
        }
    });
    $('.item-op-1').click(function () {
        let pointSort_num = $(this).html();
        json.sort(pointSort_num, sortingArr);
        // console.log('ref from giveEvents1()');
        showItems();
        // refresh();
        sortingArr = [];
        pointSort_num = undefined;
        changeRightPage('#shell');
    });
}

function giveEvents2() {
    $('#menuDelete').click(menuDelete);
    $('#menuCopy').click(menuCopy);
    $('#menuCopyAfter').click(menuCopyAfter);
    // $('#openExtLink').click(menuOpenExtLink);
}

function OLDhasClipboardFiles() {
    return clipboard.has('FileNameW');
}

function OLDinit() {
    if (folderTogetContents != path.join(tempPath, 'sjcm-user-contents')) {
        refresh();
        return;
    }

    createTempFolderIfnot();
    datafunc();
    let tempDir = path.join(tempPath, 'sjcm-user-contents');
    if (fs.existsSync(tempDir)) rimraf.sync(tempDir);
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);
    try {
        makeFilesFromJson(fs.readFileSync(folderToSaveJson + '/' + jsonDbName + '.json'), true);
    } catch (e) {
        autoCommand.add('🖵 initializing', e.noJson);
        autoCommand.run();
        return;
    }
    showItems();
}

function logFinalJson() {
    console.log('type: ', typeof finalJSON);
    console.log(finalJSON);
}

function OLDmakeFilesFromJson(stringifiedJson = null, auto = false) {
    try {
        if (stringifiedJson == null) {
            stringifiedJson = JSON.stringify(finalJSON);
        }
        if (stringifiedJson.length == 0) {
            if (auto) {
                autoCommand.add('🖵 make files from json', e.noFileCreated);
                autoCommand.run();
            }
            return e.noFileCreated;
        }
        if (folderToSaveJson == '') {
            getGlobaldata('folderToSaveJson');
            return;
        }
        let jsoned = JSON.parse(stringifiedJson);
        fs.readdirSync(folderTogetContents).forEach(function (v, i) {
            fs.unlinkSync(path.join(folderTogetContents, v));
        });
        jsoned.forEach(function (v, i) {
            buildFileFromSingleJson(v);
        });
        if (auto) {
            autoCommand.add('🖵 make files from json', 'successful');
            autoCommand.run();
        }
        return 'successful'
    } catch (e) {
        console.log(e);
        alert('error in makeFilesFromJson');
    }
}
// function makeItemsFromJson () {
//     alert('ok');
// }
function OLDmakePageFromFolder(option = null) {
    try {
        $('.items-c').empty();
        if (folderToSaveJson == '') {
            // dialog.showMessageBoxSync({type: "warning", message: 'first choose folderToSaveJson'});
            return '<span>first choose a folder to save your json file<br/> use <span class="cmd-in-cmd">set folder to save json</span></span>';
        }
        if (folderTogetContents == '') {
            dialog.showMessageBoxSync({
                type: "warning",
                message: 'first choose folderTogetContents'
            });
            return;
        }
        if (jsonDbName == '') {
            dialog.showMessageBoxSync({
                type: "warning",
                message: 'first choose your jsonDbName'
            });
            return;
        }
        // TODO: make an option for users, so they can use contents folder as the folderToSaveJson
        let fileARR = [];
        let jsonFileName = jsonDbName;
        let page_db_path = folderTogetContents;
        page_db_path = page_db_path.toString();
        // TODO: does it really needs to be an string?
        showItems();
        if (option != 'refresh') {
            dialog.showMessageBoxSync({
                type: 'info',
                message: '1- we loaded your contents succesfully \n2- we created (overwrited) a json file from your contents'
            });
        }


    } catch (e) {
        dialog.showMessageBoxSync({
            type: "warning",
            title: "HINT",
            message: "it\'s highly recommended to set user-manifest.json first"
        });
    }
};

function OLDmakeWholeSorts(arr) {
    let min = Math.min.apply(null, arr);
    let max = Math.max.apply(null, arr);
    let length = finalJSON.length;
    let expected_arr = [];
    for (let i = 1; i <= length; i++) {
        if (i < min || i > max) {
            expected_arr.push(i);
        } else if (i == min) {
            for (let j = 0; j < arr.length; j++) {
                expected_arr.push(arr[j]);
            }
        }
    }
    return expected_arr;
}

function OLDmakeJson(fileARR, postname) {
    try {
        let fileARRLength = fileARR.length,
            counter = 0;
        finalJSON = [];
        if (fileARRLength == 0) fs.writeFileSync(folderToSaveJson + '/' + postname + '.json', '');
        fileARR.forEach(function (v, i) {
            let path = v.path;
            path = path.replace(/\\/g, "\/");
            finalJSON.push({
                "sort_num": v.sort_num,
                "type": v.type,
                "group": v.group,
                "format": v.format,
                "path": path.toString(),
                "content": fs.readFileSync(path, 'utf8')
            });

            counter += 1;
            if (fileARRLength == counter) {
                let result = '';
                result = finalJSON;
                result = JSON.stringify(finalJSON);
                if (folderToSaveJson == '') {
                    get_folderToSaveJson(makePageFromFolder);
                }
                fs.writeFileSync(folderToSaveJson + '/' + postname + '.json', result);
            }
        });
    } catch (e) {
        // alert('gottt it');
    }
    return;
}

function OLDmenuDelete() {
    let userOK = dialog.showMessageBoxSync({
        'type': 'warning',
        buttons: ['Cancel', 'yes'],
        'message': 'am i sure?'
    });
    if (userOK == 0) return false;
    if (sortingArr.length == 0) dialog.showMessageBoxSync({
        type: 'warning',
        message: 'no file selected for this action'
    });
    sortingArr.forEach(function (v, i) {
        deleteBySortNum(v);
    });
    refresh();
    sortingArr = [];
}

function menuDelete() {
    let userOK = dialog.showMessageBoxSync({
        'type': 'warning',
        buttons: ['Cancel', 'yes'],
        'message': 'am i sure?'
    });
    if (userOK == 0) return false;
    if (sortingArr.length == 0) dialog.showMessageBoxSync({
        type: 'warning',
        message: 'no file selected for this action'
    });
    sortingArr.forEach(function (v, i) {
        deleteBySortNum(v);
    });
    showItems();
    sortingArr = [];
}

function color(color) {
    syncUndo();
    sortingArr.forEach(function (v, i) {
        finalJSON.forEach(function (vv, ii) {
            if (vv.sort_num == v) {
                finalJSON[ii]['color'] = color;
            }
        })
    });
    json.write();
    showItems();
    sortingArr = [];
}

function OLDmneuOpenExtLink() {
    if (sortingArr.length == 0) dialog.showMessageBoxSync({
        type: 'warning',
        message: 'no file selected for this action'
    });
    sortingArr.forEach(function (v, i) {
        showInExplorer(v);
    });
}

function menuCopy() {
    if (sortingArr.length == 0) dialog.showMessageBoxSync({
        type: 'warning',
        message: 'no file selected for this action'
    });
    sortingArr.forEach(function (v, i) {
        copy(v);
    });
    showItems();
    sortingArr = [];
}

function menuCopyAfter() {
    if (sortingArr.length == 0) dialog.showMessageBoxSync({
        type: 'warning',
        message: 'no file selected for this action'
    });
    sortingArr.sort(function (a, b) {
        return a - b
    });
    sortingArr.forEach(function (v, i) {
        copyAfter(Number(v), true);
        sortingArr.forEach(function (v, i) {
            sortingArr[i] = Number(v) + 1;
        });
    });
    showItems();
    sortingArr = [];
}

function makePermaLink(auto = false) {
    let oldConf;
    let confIndex;
    finalJSON.forEach(function (v, i) {
        if (v.type == 'conf' && v.group == 'conf') {
            oldConf = v.content;
            confIndex = i;
        }
    });
    if (!oldConf) return 'no configuration file found';
    try {
        oldConf = JSON.parse(oldConf);
    } catch (e) {
        console.log('it seems that the file is not in json format');
    }
    oldConf['permalink'] = makePermalinkSelf();
    finalJSON[confIndex]['content'] = JSON.stringify(oldConf);
    json.write();
    showItems();
    datafunc();
    if (auto) {
        autoCommand.add('🖵 make permalink');
        autoCommand.run();
    }
}

function makePermalinkSelf(ff = folderToSaveJson, from = '_data') {
    let endOf_dataPos = ff.lastIndexOf(from) + 6;
    let permalink = '/' + ff.substring(endOf_dataPos);
    return permalink;
}

function makeAconf() {
    autoCommand.add('create -conf');
    autoCommand.run();
}

function openjson() {
    let jsonFile = dialog.showOpenDialogSync({
        properties: ['openFile'],
        title: 'open a json file',
        extensions: ['*'],
        buttonLabel: 'choose this json'
    })[0];
    let folderToSaveJson = path.dirname(jsonFile);
    let jsonDbName = path.basename(jsonFile, '.json');
    new_manifest = `{\n"folderToSaveJson": "${folderToSaveJson.replace(/\\/g,'/')}",\n"folderTogetContents": "${folderTogetContents.replace(/\\/g,'/')}",\n"jsonDbName": "${jsonDbName}"\n}`;
    // new_manifest = `{"folderToSaveJson": "C:/Users/ashkan nasirzadeh/Desktop/ashkan-nasirzadeh.ir/_data/computer-science","folderTogetContents": "C:/Users/ASHKAN~1/AppData/Local/Temp/sjcm-user-contents","jsonDbName": "alitest"}`;
    configManifest_reload();
    showItems();
    finalJSON = json.return();
    // let files = fs.readdirSync(folderTogetContents);
    // files.forEach(function (v, i) {
    //     let file = path.join(folderTogetContents,v);
    //     if (fs.existsSync(file)) fs.unlinkSync(file);
    // });
    // makeFilesFromJson (fs.readFileSync(folderToSaveJson + '/' + jsonDbName + '.json'), true);
    // refresh();
}

function OLDopenItem(path) {
    shell.openItem(path);
}

function openItem(num) {
    $('body').append(`
        <div class="editor-c" data-id="` + num + `">
            <div class="editor">
                <div class="topbar">
                    <div>
                        <div class="editorLink" id="editor-link">
                            <div class="editorLogo"></div><div class="editorShortcut">ctrl+L</div>
                        </div>
                        <div class="editorLink" id="editor-bold">
                            <div class="editorLogo"></div><div class="editorShortcut">ctrl+B</div>
                        </div>
                        <div class="editorLink" id="editor-underline">
                            <div class="editorLogo"></div><div class="editorShortcut">ctrl+U</div>
                        </div>
                        <div class="editorLink" id="editor-italic">
                            <div class="editorLogo"></div><div class="editorShortcut">ctrl+I</div>
                        </div>
                        <div class="editorLink" id="editor-direction">
                            <div class="editorLogo"></div><div class="editorShortcut">ctrl+D</div>
                        </div>
                        <div class="editorLink" id="editor-undo">
                            <div class="editorLogo"></div><div class="editorShortcut">ctrl+Z</div>
                        </div>
                        <div class="editorLink" id="editor-redo">
                            <div class="editorLogo"></div><div class="editorShortcut">ctrl+Y</div>
                        </div>
                        <div class="editorLink" id="editor-br">
                            <div class="editorLogo"></div><div class="editorShortcut"></div>
                        </div>
                    </div>
                    <div>
                        <div class="editorLink" id="sortNumField">
                            <div class="editorLogo">` + num + `</div><div class="editorShortcut">Num.</div>
                        </div>
                    </div>
                    <div>
                        <div class="editorLink" id="editor-close-hard">
                            <div class="editorLogo"></div><div class="editorShortcut"></div>
                        </div>
                        <div class="editorLink" id="editor-close-soft">
                            <div class="editorLogo"></div><div class="editorShortcut">ctrl+E</div>
                        </div>
                    </div>
                    
                </div>
                <div class="editorbar" id="editorbar" contenteditable="true"></div>
            </div>
        </div>
    `);
    setupEditor(num);
}

function OLDosStuffs() {
    let platform = os.platform();
    if (platform == 'win32') directory_separator = '\\';
    else directory_separator = '/';
}

function OLDopenPost() {
    shell.openItem(postExists());
}

function openPostFolder() {
    let containingFolder = path.dirname(postExists());
    require('child_process').exec('start "" "' + containingFolder + '"');
}

function prompter(sortnum, field) {
    let oldGroup;
    let oldType;
    finalJSON.forEach(function (v, i) {
        if (v.sort_num == sortnum) {
            oldGroup = v.group;
            oldType = v.type;
        }
    });
    let label;
    let value;
    let deleteBoolean;
    if (field == 'group') {
        label = 'please write your new group name:';
        value = oldGroup;
    }
    if (field == 'type') {
        label = 'please write your new type name:';
        value = oldType;
    }
    prompt({
            title: '',
            label: label,
            value: value,
            type: 'input',
            icon: 'assets/sjcm.png'
        })
        .then((r) => {
            if (r == undefined) return;
            syncUndo();
            if (r != value) deleteBoolean = true;
            if (field == 'group') changeGrpName(sortnum, r);
            if (field == 'type') changeTypeName(sortnum, r);
        })
        .catch(console.error);
}

function OLDpage_assets_name_decoder(file) {
    let toReturn = {};
    let sepPoses = [];
    // !@#$text&!%#&header&!%#&1!@#$.txt
    sepPoses.push(file.indexOf('!@#$', 0) + 4);

    let last_sep_pos = file.indexOf('&!%#&', file.indexOf('!@#$', 0) + 4);
    do {
        if (last_sep_pos == -1) {
            break;
        }
        sepPoses.push(last_sep_pos);
        sepPoses.push(last_sep_pos + 5);
        last_sep_pos = file.indexOf('&!%#&', last_sep_pos + 5);
    }
    while (last_sep_pos != -1)

    sepPoses.push(file.indexOf('!@#$', file.indexOf('!@#$', 0) + 4))
    for (let i = 0; i < sepPoses.length; i += 2) {
        let slice = file.substring(sepPoses[i], sepPoses[i + 1]);
        let file_key = slice.substring(0, slice.indexOf('='));
        let file_val = slice.substring(slice.indexOf('=') + 1);
        toReturn[file_key] = file_val;
    }
    toReturn['format'] = file.substring(file.lastIndexOf('.') + 1);
    // {type: "text", group: "header", sort_num: "1", format: "txt"}
    // page_assets_name_decoder('!@#$type=text&!%#&group=header&!%#&sort_num=1!@#$.txt');
    return toReturn;
}

function OLDrefresh(auto = false) {
    try {
        makePageFromFolder('refresh');
        datafunc();
        if (auto) {
            autoCommand.add('🖵 refresh', 'successful');
            autoCommand.run();
        }
    } catch (e) {
        autoCommand.add('🖵 refresh', e.refresh);
        autoCommand.run();
    }
}

function OLDrefresh2() {
    makeFilesFromJson(JSON.stringify(finalJSON));
    makePageFromFolder('refresh');
}

function OLDrefresh3() {
    setupManifest();
    refresh(true);
    giveEvents2();
}

function reSort(auto = false) {
    try {
        syncUndo();
        finalJSON.forEach(function (v, i) {
            finalJSON[i]['sort_num'] = (i + 1).toString();
        });
        json.write();
        showItems();
        if (auto) {
            autoCommand.add('🖵 resort', 'resort done');
            autoCommand.run();
        }
    } catch (e) {
        if (auto) {
            autoCommand.add('🖵 resort', e.resort);
            autoCommand.run();
        }
    }

}

function sayConfExists() {
    if (confExists()) $('*[data-func="sayConfExists()"]').html('have');
    else $('*[data-func="sayConfExists()"]').html('<span style="color:red">don\'t have<span>');
}

function createPostPath() {
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let toReturn = year + '-' + month + '-' + day + '-' + jsonDbName + '.html';
    let initialPath = makePermalinkSelf().replace('/', '');
    let post = path.join(postFolderPath, initialPath, toReturn);
    return post;
}

function createPostPathWithoutName() {
    let initialPath = makePermalinkSelf().replace('/', '');
    let post = path.join(postFolderPath, initialPath);
    return post;
}

function postExists() {
    let toReturn = false;
    let postPath = createPostPathWithoutName();
    try {
        let files = fs.readdirSync(postPath);
        files.forEach(function (v, i) {
            let q = path.join(postPath, v);
            let postName = new RegExp(jsonDbName, "g");
            if (q.match(postName) && q.search(/[1-9][0-9][0-9][0-9]-[1-9]([0-2]|)-[1-9]([0-9]|)-(?:.)+/g) !== -1 && q.search(/_posts/g) !== -1) {
                toReturn = q;
            }
        });
    } catch (e) {}
    return toReturn;
}

function postPathExists() {
    postPath = postFolderPath;
    if (fs.existsSync(postPath)) return true;
    else return false;
}

function sayPostExists() {
    if (postExists()) $('*[data-func="sayPostExists()"]').html('have');
    else $('*[data-func="sayPostExists()"]').html('<span style="color:red">don\'t have<span>');
}

function SyncPostFolderPathBtn() {
    if (postPathExists()) $('*[data-func="SyncPostFolderPathBtn()"]').addClass('btn-deactive');
    else $('*[data-func="SyncPostFolderPathBtn()"]').removeClass('btn-deactive');
}

function createPost() {
    try {
        function createSjcmPath() {
            let initialPath = makePermalinkSelf().replace('/', '.');
            let sjcmPath = 'data' + initialPath + '.' + jsonDbName;
            return sjcmPath;
        }
        let postPathWithoutName = createPostPathWithoutName();
        let postPath = createPostPath();
        fs.mkdirSync(postPathWithoutName, {
            recursive: true
        });
        let frontMatter =
            `---
        layout: post1
        permalink: ${makePermalinkSelf()}
        title: ${jsonDbName}
        sjcm: ${createSjcmPath()}
        ---`;
        fs.writeFileSync(postPath, frontMatter.replace(/    /g, ''));
        showItems();
        datafunc();
    } catch (e) {
        console.log('jjj');
        throw e;
    }
}

function SyncCreatePostBtn() {
    if (postPathExists() && !postExists()) $('*[data-func="SyncCreatePostBtn()"]').removeClass('btn-deactive');
    else $('*[data-func="SyncCreatePostBtn()"]').addClass('btn-deactive');
}

function SyncConfBtn() {
    if (confExists()) $('*[data-func="SyncConfBtn()"]').addClass('btn-deactive');
    else $('*[data-func="SyncConfBtn()"]').removeClass('btn-deactive');
}

function SyncOpenPostBtn() {
    if (postExists()) $('*[data-func="SyncOpenPostBtn()"]').removeClass('btn-deactive');
    else $('*[data-func="SyncOpenPostBtn()"]').addClass('btn-deactive');
}

function SyncDeletePostBtn() {
    if (postExists()) $('*[data-func="SyncDeletePostBtn()"]').removeClass('btn-deactive');
    else $('*[data-func="SyncDeletePostBtn()"]').addClass('btn-deactive');
}

function SyncPermaBtn() {
    let oldJson;
    finalJSON.forEach(function (v, i) {
        if (v.type == 'conf' && v.group == 'conf') {
            oldjson = v.content;
        }
    });
    try {
        oldJson = JSON.parse(oldjson);
    } catch (e) {
        return 'it seems that the file is not in json format';
    }
    if (oldJson['permalink']) {
        $('*[data-func="SyncPermaBtn()"]').addClass('btn-deactive');
    } else {
        $('*[data-func="SyncPermaBtn()"]').removeClass('btn-deactive');
    }
}

function syncUndo() {
    try {
        undo9 = JSON.parse(JSON.stringify(undo8));
        undo8 = JSON.parse(JSON.stringify(undo7));
        undo7 = JSON.parse(JSON.stringify(undo6));
        undo6 = JSON.parse(JSON.stringify(undo5));
        undo5 = JSON.parse(JSON.stringify(undo4));
        undo4 = JSON.parse(JSON.stringify(undo3));
        undo3 = JSON.parse(JSON.stringify(undo2));
        undo2 = JSON.parse(JSON.stringify(undo1));
        if (JSON.stringify(undo1) != JSON.stringify(finalJSON)) undo1 = JSON.parse(JSON.stringify(finalJSON));
        undoCounter = 0;
    } catch (e) {
        console.log('error in syncUndo()');
    }
}

function OLDsorter1(pointSort_num, sortingArr) {
    syncUndo();
    let totalLength = finalJSON.length;
    if (totalLength == 0) {
        dialog.showMessageBoxSync({
            type: "warning",
            title: "no refrence error",
            message: "no json file has choosen to use"
        });
        return;
    }
    let sortingArrUp = [];
    let sortingArrDown = [];
    sortingArr.forEach(function (v, i) {
        if (pointSort_num < v) {
            sortingArrUp.push(v);
            sortingArrUp.sort(function (a, b) {
                return b - a
            });
        } else {
            sortingArrDown.push(v);
            sortingArrDown.sort(function (a, b) {
                return b - a
            });
        }
    });
    sortingArrUp.forEach(function (v, i) {
        sorter2(pointSort_num, Number(v) + Number(i));
    });
    sortingArrDown.forEach(function (v, i) {
        sorter2(pointSort_num, Number(v) + Number(i));
    });
    sortingArr = [];
}

function sorter2(point, comer) {
    console.log('point:', point);
    console.log('comer:', comer);
    let comer_sortNum_index;
    let point_sortNum_index;
    let oldSortnums = [];
    finalJSON.forEach(function (v, i) {
        oldSortnums.push(v.sort_num);
        if (v.sort_num == comer) comer_sortNum_index = i;
        if (v.sort_num == point) point_sortNum_index = i;
    });
    array_move(finalJSON, comer_sortNum_index, point_sortNum_index);
    finalJSON.forEach(function (v, i) {
        finalJSON[i]['sort_num'] = oldSortnums[i];
    });
    fs.writeFileSync(json.path(), JSON.stringify(finalJSON));
    showItems();
}

function OLDsjcm_delete(backedOBJ) {
    let delBy = backedOBJ[0];
    let delval = backedOBJ[1];
    if (delBy == '' || delBy == 'sort number') delBy = 'sort_num';
    if (delBy == 'sort_num') return deleteBySortNum(delval) ? `row with sort number ${delval} deleted` : `oops something is wrong`;
    if (delBy == 'group') return deleteByGrp(delval) ? `rows with group named ${delval} deleted` : `oops something is wrong`;
}

function OLDsetClipboardFiles(filePaths) {
    clipboard.writeBuffer('CFSTR_FILENAMEW', Buffer.from(plist.build(filePaths)));
}

function setupManifest() {
    $('#manifest-monitor-btn').html(`<span><c>contentsDir:</c> <c style="color:red">not set</c><br><c>jsonDir:</c> <c style="color:red">not set</c><br><c>jsonName:</c> <c style="color:red">not set</c></span>`);
    let man_json;
    try {
        man_json = JSON.parse(fs.readFileSync("user-manifest.json", 'utf-8').replace(/\\/g, '/'));
    } catch (e) {
        man_json = {
            "folderToSaveJson": '',
            "jsonDbName": ''
        };
    }
    if (man_json.folderToSaveJson == man_json.folderTogetContents && man_json.folderToSaveJson != '' && man_json.folderTogetContents != '') return false;
    folderToSaveJson = man_json.folderToSaveJson;
    jsonDbName = man_json.jsonDbName;
    let forShow_json = (folderToSaveJson != '' && folderToSaveJson != undefined && fs.existsSync(folderToSaveJson)) ? '.../' + folderToSaveJson.substring(folderToSaveJson.lastIndexOf('/') + 1) : '<c style="color:red">not set</c>';
    let forShow_jsonName = (jsonDbName != '' && jsonDbName != undefined) ? jsonDbName : '<c style="color:red">not set</c>';

    let tooltip_json = forShow_json != '<c style="color:red">not set</c>' ? folderToSaveJson : 'not set';
    let tooltip_jsonName = forShow_jsonName != '<c style="color:red">not set</c>' ? jsonDbName : 'not set';
    $('#manifest-monitor-btn').html(`<span>
    <c path='${tooltip_json}'>jsonDir:</c><cc title='${tooltip_json}'>${forShow_json}</cc><br>
    <d>jsonName:</d><cc title='${tooltip_jsonName}'>${forShow_jsonName}</cc></span>`);
    $('c').click(function () {
        let path = $(this).attr('path');
        if (path == 'not set') {
            dialog.showMessageBoxSync({
                type: "warning",
                message: "the directory is not set by user"
            });
            return;
        }
        require('child_process').exec('start "" "' + path + '"');
    });
}

function OLDshowItems() {
    page_db_path = folderTogetContents;
    let fileARR = [];
    // TODO: does it really needs to be an string?

    let files = fs.readdirSync(page_db_path);
    for (let file of files) {
        let filepath = path.join(page_db_path, file);
        let toPush = page_assets_name_decoder(file);
        toPush['path'] = filepath;
        fileARR.push(toPush);
    }
    fileARR.sort((a, b) => Number(a.sort_num) > Number(b.sort_num) ? 1 : -1);
    makeJson(fileARR, jsonDbName);
    fileARR.forEach(function (v, i) {
        let num = v.sort_num;
        let grp = v.group;
        let type = v.type;
        let path = v.path;
        path = path.replace(/\\/g, "\\\\");
        if (type == 'conf' && grp == 'conf') {
            $('.items-c').append(`
                <div class="item-c conf">
                <div class="item-op-8" title=""></div>
                <div class="item-op-1" title="${num}">` + num + `</div>
                <div class="item-op-2" title="refresh content: ${getContent(this,path)}" onclick="getContent(this, '` + path + `')"></div>
                <div class="item-op-7 confImgSettings" onclick=""></div>
                <div class="item-op-3" title="delete" onclick="deleteBySortNumCertificated('` + num + `')"><img></div>
                <div class="item-op-4" title="edit in S.J.C.M editor" onclick="openItem('` + num + `')"><img></div>
                <div class="confImgHide" title="hide configurarion item" onclick="toggleConfHide()"><img></div>
                <div class="item-op-6" title="configuration item">` + grp + `</div>
                </div>
            `);
        } else {
            $('.items-c').append(`
                <div class="item-c">
                <div class="item-op-8" title="type" onclick="prompter('` + num + `','type')"><span>` + type + `</span></div>
                <div class="item-op-1" title="${num}">` + num + `</div>
                <div class="item-op-2" title="refresh content: ${getContent(this,path)}" onclick="getContent(this, '` + path + `')"></div>
                <div class="item-op-7" title="copy after" onclick="copyAfter('` + num + `')"><img></div>
                <div class="item-op-3" title="delete" onclick="deleteBySortNumCertificated('` + num + `')"><img></div>
                <div class="item-op-4" title="edit in S.J.C.M editor" onclick="openItem('` + num + `')"><img></div>
                <div class="item-op-5">
                <label class="label1" data-ForSort1="` + num + `">
                <input type="checkbox">
                <span class="checkmark"></span>
                </label></div>
                <div class="item-op-6" title="group" onclick="prompter('` + num + `','group')">` + grp + `</div>
                </div>
            `);
        }
    });
    $('.item-op-2').click(); // TODO: it's not standard!
    giveEvents1();
}

function showItems() {
    let allcontent = json.return(false, true);
    if (allcontent === false) return;
    $('.items-c').empty();
    allcontent.forEach(function (v, i) {
        let num = v.sort_num;
        let grp = v.group;
        let type = v.type;
        let path = v.path;
        let content = v.content;
        let color = v.color;
        let direction = type == 'bdi-text' ? 'rtl' : 'ltr';
        if (path) path = path.replace(/\\/g, "\\\\");
        if (type == 'conf' && grp == 'conf') {
            $('.items-c').append(`
                <div class="item-c conf">
                <div class="item-op-8" title=""></div>
                <div class="item-op-1" title="${num}">` + num + `</div>
                <div class="item-op-2" title="${content}">${content}</div>
                <div class="item-op-7 confImgSettings" onclick=""></div>
                <div class="item-op-3" title="delete" onclick="deleteBySortNumCertificated('` + num + `')"><img></div>
                <div class="item-op-4" title="edit in your default editor" onclick="openItem('` + num + `')"><img></div>
                <div class="confImgHide" title="hide configurarion item" onclick="toggleConfHide()"><img></div>
                <div class="item-op-6" title="configuration item">` + grp + `</div>
                </div>
            `);
        } else {
            $('.items-c').append(`
                <div class="item-c" style="background-color: ${color}">
                <div class="item-op-8" title="type" onclick="prompter('` + num + `','type')"><span>` + type + `</span></div>
                <div class="item-op-1" title="${num}">` + num + `</div>
                <div class="item-op-2" title="${content}" style='direction: ${direction}'>${content}</div>
                <div class="item-op-7" title="copy after" onclick="copyAfter('` + num + `')"><img></div>
                <div class="item-op-3" title="delete" onclick="deleteBySortNumCertificated('` + num + `')"><img></div>
                <div class="item-op-4" title="edit in your default editor" onclick="openItem('` + num + `')"><img></div>
                <div class="item-op-5">
                <label class="label1" data-ForSort1="` + num + `">
                <input type="checkbox">
                <span class="checkmark"></span>
                </label></div>
                <div class="item-op-6" title="group" onclick="prompter('` + num + `','group')">` + grp + `</div>
                </div>
            `);
        }
    });
    giveEvents1();
}

function serverCheck() {
    document.getElementById('checkBTN').innerHTML = 'wait...';
    let toRetrun = false;
    let pspath = app.getAppPath();
    pspath = path.join(pspath, 'scripts', 'check.ps1');
    // console.log(hf.pathToPs(pspath, '/'));
    child = spawn("powershell.exe", [hf.pathToPs(pspath)]);
    child.stdout.on('data', (data) => {
        toRetrun = data;
    });
    child.stdout.on('close', (data) => {
        document.getElementById('checkBTN').innerHTML = 'ReCheck';
        if (toRetrun && toRetrun == 4000) showOpenServer();
        else showClosedServer();
    });
}

function serverStart() {
    document.getElementById('startBTN').innerHTML = 'wait...';
    let siteRootDir = dialog.showOpenDialogSync({
        properties: ['openDirectory'],
        buttonLabel: 'choose this as your website root dir'
    })[0];
    let cmd = 'cd ' + siteRootDir.replace(/\\/g, '/') + ' & bundle exec jekyll serve --watch';
    child = spawn(cmd, [], {
        shell: true
    });
    child.stdout.on('data', (data) => {
        document.getElementById('startBTN').innerHTML = 'start';
        serverCheck();
    });
}

function serverStop() {
    document.getElementById('stopBTN').innerHTML = 'wait...';
    let pspath = app.getAppPath();
    pspath = path.join(pspath, 'scripts', 'close.ps1');
    child = spawn("powershell.exe", [hf.pathToPs(pspath)]);
    child.stdout.on("data", function (data) {
        document.getElementById('stopBTN').innerHTML = 'stop';
        serverCheck();
    });
}

function showOpenServer() {
    $('#serverStatus').removeClass('closeserver');
    $('#serverStatus').addClass('openserver');
    $('#serverStatus').find('.inAnnounce').html('is');
}

function showClosedServer() {
    $('#serverStatus').removeClass('openserver');
    $('#serverStatus').addClass('closeserver');
    $('#serverStatus').find('.inAnnounce').html('is not');
}

function toggleConfHide() {
    confHide = confHide == 'none' ? 'grid' : 'none';
    $('.confImgHide').parent('.item-c').css('display', confHide);
}

function OLDcheck_syncUndo() {
    return _syncUndo;
}

function OLDwatcherStart(path) {
    var chokidar = require("chokidar");

    var watcher = chokidar.watch(path, {
        ignored: /[\/\\]\./,
        persistent: true
    });

    function onWatcherReady() {
        // console.info('From here can you check for real changes, the initial scan has been completed.');
    }

    // Declare the listeners of the watcher
    watcher
        .on('change', function (path) {
            refresh();
        })
        .on('add', function (path) {})
        // .on('addDir', function(path) {
        // })
        .on('unlink', function (path) {})
        // .on('unlinkDir', function(path) {
        // })
        // .on('error', function(error) {
        // })
        .on('ready', onWatcherReady)
        .on('raw', function (event, path, details) {});
}

function OLDwatcherEnd(path) {
    // console.log(path);
    var chokidar = require("chokidar");

    var watcher = chokidar.watch(path, {
        ignored: /[\/\\]\./,
        persistent: true
    });
    watcher.close().then(() => console.log('closed'));
}

function OLDshowInExplorer(sortnum) {
    try {
        finalJSON.forEach(function (v, i) {
            if (sortnum == v.sort_num) {
                //ifWindows:
                shell.showItemInFolder(v.path.replace(/\//g, '\\'));
            }
        });
        return;
    } catch (e) {
        alert('error in showInExplorer');
    }
}

function openLastCreated() {
    if (!lastCreatedNum) {
        dialog.showMessageBoxSync({
            type: 'warning',
            message: 'no previous sortnum in history'
        });
        return;
    }
    openItem(lastCreatedNum);
}

function undo(auto = false) {
    try {
        let point;
        undoCounter += 1;
        console.log(undoCounter);
        if (undoCounter == 10) {
            if (auto) {
                undoCounter = 9;
                // dialog.showMessageBoxSync({type: 'warning', message: 'no more undo available'});
                autoCommand.add('🖵 Undo', 'no more undo available');
                autoCommand.run();
                return;
            }
            undoCounter = 9;
            dialog.showMessageBoxSync({
                type: 'warning',
                message: 'no more undo available'
            });
            return;
        };
        if (undoCounter == 1) oldFinalJson = JSON.parse(JSON.stringify(finalJSON));

        if (undoCounter == 1) point = undo1;
        if (undoCounter == 2) point = undo2;
        if (undoCounter == 3) point = undo3;
        if (undoCounter == 4) point = undo4;
        if (undoCounter == 5) point = undo5;
        if (undoCounter == 6) point = undo6;
        if (undoCounter == 7) point = undo7;
        if (undoCounter == 8) point = undo8;
        if (undoCounter == 9) point = undo9;
        if (JSON.stringify(finalJSON) != JSON.stringify(point)) {
            finalJSON = point;
        } else {
            // if (auto) {undo(true); return;}
            // else undo(); return;
        };
        json.write();
        showItems();
        if (auto) {
            autoCommand.add('🖵 undo', 'done');
            autoCommand.run();
        }
    } catch (e) {
        console.log(e);
        if (auto) {
            autoCommand.add('🖵 undo', e.undo);
            autoCommand.run();
        }
    }

}

function redo(auto = false) {
    try {
        let point;
        undoCounter -= 1;
        if (undoCounter == -1) {
            if (auto) {
                undoCounter = 0;
                autoCommand.add('🖵 Redo', 'no more redo available');
                autoCommand.run();
                return;
            }
            dialog.showMessageBoxSync({
                type: 'warning',
                message: 'no more redo available'
            });
            undoCounter = 0;
            return;
        };

        if (undoCounter == 0) point = oldFinalJson;
        if (undoCounter == 1) point = undo1;
        if (undoCounter == 2) point = undo2;
        if (undoCounter == 3) point = undo3;
        if (undoCounter == 4) point = undo4;
        if (undoCounter == 5) point = undo5;
        if (undoCounter == 6) point = undo6;
        if (undoCounter == 7) point = undo7;
        if (undoCounter == 8) point = undo8;
        if (undoCounter == 9) point = undo9;
        if (JSON.stringify(finalJSON) != JSON.stringify(point)) {
            finalJSON = point;
        } else {
            if (auto) {
                redo(true);
                return;
            } else {
                redo();
                return;
            }
        }
        json.write();
        showItems();
        if (auto) {
            autoCommand.add('🖵 redo', 'done');
            autoCommand.run();
        }
    } catch (e) {
        if (auto) {
            autoCommand.add('🖵 redo', e.redo);
            autoCommand.run();
        }
    }
}

function choose_dataFolder() {
    let dataFolderPathArr = dialog.showOpenDialogSync({
        title: '',
        properties: ['openDirectory'],
        buttonLabel: 'choose this as _data folder'
    });
    dataFolderPath = dataFolderPathArr[0];
    datafunc();
}

function syncDataFolderChoose() {
    if (dataFolderPath == '') $('*[data-func="syncDataFolderChoose()"]').removeClass('btn-deactive');
    else $('*[data-func="syncDataFolderChoose()"]').addClass('btn-deactive');
}

function syncMakeSearch() {
    if (dataFolderPath == '') $('*[data-func="syncMakeSearch()"]').addClass('btn-deactive');
    else $('*[data-func="syncMakeSearch()"]').removeClass('btn-deactive');
}

function makeSearchTreasure() {
    let jsonFilesPaths = [];
    let pending = [dataFolderPath];

    function explorer(folderToExplor) {
        pending.shift();
        let a = fs.readdirSync(folderToExplor);
        a.forEach((v, i) => {
            let path = folderToExplor + '/' + v
            if (fs.lstatSync(path).isDirectory()) pending.push(path);
            else jsonFilesPaths.push(path);
        });
        if (pending[0]) explorer(pending[0])
    }
    explorer(dataFolderPath);

    function makeFinaleFile() {
        let finalSearchJson = []
        jsonFilesPaths.forEach((v, i) => {
            let jsonPath = v;
            let jsonContent = JSON.parse(fs.readFileSync(v, 'utf-8'));
            let jsonlink = 'www.ashkan-nasirzadeh.ir/' + jsonPath.slice(jsonPath.indexOf('_data') + 6, jsonPath.indexOf('.json'));
            jsonContent.forEach((v, i) => {
                finalSearchJson.push({
                    "path": jsonlink,
                    "content": v.content
                });
            })
        })
        let searchIndex = JSON.stringify(finalSearchJson);
        searchIndex = 'let treasure =' + searchIndex;
        let toSaveFile = dialog.showOpenDialogSync({
            properties: ['openFile'],
            title: 'choose a file to save there',
            extensions: ['*'],
            buttonLabel: 'choose a file to save search index'
        })[0];
        fs.writeFileSync(toSaveFile, searchIndex);
    }
    console.log(makeFinaleFile());
}
$('body').keydown((e) => {
    if (e.ctrlKey && e.keyCode === 74) $('.prompt-command-class').focus(); //ctrl+j
    if (e.ctrlKey && e.keyCode === 75) openLastCreated(); // ctrl+k
});
// TODO: make help : make sample name

// function copyJson () {
//     let src = folderToSaveJson + '/' + jsonDbName + '.json';
//     https://github.com/electron/electron/issues/9035
//     https://www.codeproject.com/Reference/1091137/Windows-Clipboard-Formats
//     https://nodejs.org/api/buffer.html
//     https://github.com/electron/electron/blob/master/docs/api/clipboard.md
//     https://docs.microsoft.com/en-us/dotnet/api/system.windows.clipboard?view=netframework-4.8
// }

// osStuffs();
setupManifest();
showItems();
json.make();
// logFinalJson();
// refresh();
// init();
giveEvents2();
// getLastNum();
// json.add();
// watcherStart(folderTogetContents);