/* eslint-disable func-names */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
var editor = {
    dir: 'ltr',
    lineBreak: 'inline-block',
    return(sortnum) {
        let a = json.return(sortnum);
        if (!a) return;
        a = a.content;
        return a;
    },
    set(sortnum) {
        $('.editor-c .editorbar').html(this.return(sortnum));
    },
    save(sortnum) {
        syncUndo();
        let a = $('.editor-c .editorbar').html();
        // let map = {amp: '&', lt: '<', gt: '>', quot: '"', '#039': "'"};
        // a = a.replace(/&([^;]+);/g, (m, c) => map[c]);
        finalJSON.forEach((v) => {
            if (Number(v.sort_num) === Number(sortnum)) {
                v.content = a;
            }
        });
    },
};
var revisions = {
    rev1: '',
    rev2: '',
    rev3: '',
    rev4: '',
    rev5: '',
    rev6: '',
    rev7: '',
    rev8: '',
    rev9: '',
    pointer: 1,
    make() {
        let recentContent = $('#editorbar').html();
        this.rev9 = this.rev8;
        this.rev8 = this.rev7;
        this.rev7 = this.rev6;
        this.rev6 = this.rev5;
        this.rev5 = this.rev4;
        this.rev4 = this.rev3;
        this.rev3 = this.rev2;
        this.rev2 = this.rev1;
        this.rev1 = recentContent;
    },
    pointerer(move) {
        if (move === 'undo') {
            if (this.pointer >= 1 && this.pointer <= 8) {
                this.pointer += 1;
                return this.pointer;
            }
            return 9;
        } else if (move === 'reset') {
            this.pointer = 1;
        } else if (move === 'redo') {
            if (this.pointer >= 2 && this.pointer <= 9) {
                this.pointer -= 1;
                return this.pointer;
            }
            return 1;
        }
    },
    undo() {
        let point = this.pointerer('undo');
        $('#editorbar').html(eval('this.rev' + point));
    },
    redo() {
        let point = this.pointerer('redo');
        $('#editorbar').html(eval('this.rev' + point));
    },
};
function setupEditor(num) {
    editor.set(num);
    revisions.make();
    // set line break pic
    let oldLineBreak = editor.lineBreak;
    let newPicForLineBreak = (oldLineBreak === 'inline-block') ? 'line-break.png' : 'line-continuously.png';
    $('#editor-br > div:first-child').css('background-image', 'url(assets/'+newPicForLineBreak+')');
    // set Direction pic
    let oldDir = editor.dir;
    let newPicForDir = (oldDir === 'ltr') ? 'dir.png' : 'dir2.png';
    $('#editor-direction > div:first-child').css('background-image', 'url(assets/'+newPicForDir+')');
    // $('#editorbar').caret(-1);
    $('#editor-close-soft').click(() => {
        window.editor.save(num);
        $('.editor-c').remove();
        json.write();
        showItems();
    });
    $('#editor-close-hard').click(() => {
        $('.editor-c').remove();
    });
    $('#editor-direction').click(() => {
        let old = editor.dir;
        let neww = (old === 'ltr') ? 'rtl' : 'ltr';
        let newPic = (old === 'ltr') ? 'dir2.png' : 'dir.png';
        editor.dir = neww;
        $('.editorbar').css('direction', editor.dir);
        $('#editor-direction > div:first-child').css('background-image', 'url(assets/'+newPic+')');
        $('.editorbar').focus();
    });
    $('#editor-br').click(() => {

        let old = editor.lineBreak;
        let neww = (old === 'inline-block') ? 'block' : 'inline-block';
        let newPic = (old === 'inline-block') ? 'line-continuously.png' : 'line-break.png';
        editor.lineBreak = neww;
        $('.editorbar').css('display', editor.lineBreak);
        $('#editor-br > div:first-child').css('background-image', 'url(assets/'+newPic+')');
        $('.editorbar').focus();
    });
    function copyThat () {
        document.execCommand('copy');
    }
    $('.editor-c').keydown((e) => {
        if (e.ctrlKey && e.keyCode === 68) $('#editor-direction').click();
        if (e.ctrlKey && e.keyCode === 76) $('#editor-link').click();
        if (e.ctrlKey && e.keyCode === 66) $('#editor-bold').click();
        if (e.ctrlKey && e.keyCode === 85) $('#editor-underline').click();
        if (e.ctrlKey && e.keyCode === 73) $('#editor-italic').click();
        if (e.ctrlKey && e.keyCode === 90) $('#editor-undo').click();
        if (e.ctrlKey && e.keyCode === 89) $('#editor-redo').click();
        if (e.ctrlKey && e.keyCode === 69) $('#editor-close-soft').click();
        if (e.ctrlKey && e.keyCode === 67) copyThat();
    });

    $('#editor-undo').bind('click', (() => {
        revisions.undo();
    }));
    $('#editor-redo').bind('click', (() => {
        revisions.redo();
    }));
    $('.editorbar').on('input', (e) => {
        revisions.make();
        revisions.pointerer('reset');
    });
    function setupKeysDeActive () {
        $('#editor-link > div:first-child').css('background-image', 'url(assets/link2.png)');
        $('#editor-bold > div:first-child').css('background-image', 'url(assets/bold2.png)');
        $('#editor-underline > div:first-child').css('background-image', 'url(assets/underline2.png)');
        $('#editor-italic > div:first-child').css('background-image', 'url(assets/italic2.png)');
    }
    // eslint-disable-next-line prefer-arrow-callback
    $('#editorbar').on('mouseup', function () {
        let text = '';
        let sel;
        let newLink = '';
        let newBold = '';
        let newItalic = '';
        let permission = true;
        if (typeof window.getSelection !== 'undefined') {
            sel = window.getSelection();
            text = sel.getRangeAt(0);
        }
        if (text !== '' && text.startOffset !== text.endOffset) {
            newLink = `<a href="#">${text}</a>`;
            newBold = `<b>${text}</b>`;
            newItalic = `<i>${text}</i>`;
            newUnderline = `<u>${text}</u>`;
            console.log(sel);
            $('#editor-link > div:first-child').css('background-image', 'url(assets/link.png)');
            $('#editor-bold > div:first-child').css('background-image', 'url(assets/bold.png)');
            $('#editor-underline > div:first-child').css('background-image', 'url(assets/underline.png)');
            $('#editor-italic > div:first-child').css('background-image', 'url(assets/italic.png)');
            $('#editor-link').one('click', (() => {
                if (!permission) return;
                text.deleteContents();
                text.insertNode(document.createTextNode(newLink));
                revisions.make();
                revisions.pointerer('reset');
                permission = false;
                setupKeysDeActive();
            }));
            $('#editor-underline').one('click', (() => {
                if (!permission) return;
                text.deleteContents();
                text.insertNode(document.createTextNode(newUnderline));
                revisions.make();
                revisions.pointerer('reset');
                permission = false;
                setupKeysDeActive()
            }));
            $('#editor-italic').one('click', (() => {
                if (!permission) return;
                text.deleteContents();
                text.insertNode(document.createTextNode(newItalic));
                revisions.make();
                revisions.pointerer('reset');
                permission = false;
                setupKeysDeActive()
            }));
            $('#editor-bold').one('click', (() => {
                if (!permission) return;
                text.deleteContents();
                text.insertNode(document.createTextNode(newBold));
                revisions.make();
                revisions.pointerer('reset');
                permission = false;
                setupKeysDeActive()
            }));
        } else {
            setupKeysDeActive();
        }
    });
    $('.editorbar').focus();
    $('.editorbar').css('direction', editor.dir);
}
