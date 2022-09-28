const socket = io('http://localhost:3000')

socket.on('connect',()=>{
    console.log('Connected to server: ' + socket.id);
})

socket.on('new-memo', memo=>{
    showNewMemo(memo)
})

socket.on('update-memo', ()=>{
    loadMemoList()
})

let memoList = document.querySelector('.memoList')
let memoTemplate = memoList.querySelector('.memo')
memoTemplate.remove()


function showNewMemo(memo) {
    let node = memoTemplate.cloneNode(true)
    node.id = memo.id
    node.querySelector('.memoContent').textContent = memo.content // put the memo content to dom
    memoList.appendChild(node)
}

async function loadMemoList() {
    let res = await fetch('/memos')
    if(!res.ok) {
        let message = await res.text();
        console.log('failed:'+ message);
        return
    }
    let json = await res.json()
    console.log(json);
    memoList.textContent = ''
    for(let memo of json) {
        showNewMemo(memo)
    }
}

// add memo
document.querySelector('.memo').addEventListener('submit', async function(event){
    event.preventDefault()

    const form = event.target
    const formObj = {}

    formObj['content'] = form.content.value

    await fetch('/memo', {
        method:'post',
        headers:{"Content-type":"application/json"},
        body:JSON.stringify(formObj)
    })
    .then(response => console.log(response))
    .catch(err =>{
        console.log(err);
    })

    form.content.value = ''
    await loadMemoList()
})

// delete memo
async function delMemo(event) {
    event.preventDefault();
    let memoId = await event.currentTarget.parentNode.parentNode.parentNode.id
    
    fetch('/memo',{
        method:'delete',
        headers:{"Content-type":"application/json"},
        body:JSON.stringify({
            id:memoId
        })
    }).then(response => console.log(response))
    .catch(err =>{
        console.log(err);
    })
    await loadMemoList()
}

// save memo
async function saveMemo(event) {
    event.preventDefault();
    let memoId = event.currentTarget.parentNode.parentNode.parentNode.id
    let memoContent = event.currentTarget.parentNode.parentNode.parentNode.children[0].value

    console.log(memoContent);

    await fetch('/memo', {
        method:'put',
        headers:{"Content-type":"application/json"},
        body:JSON.stringify({
            id:memoId,
            content:memoContent
        })
    }).then(response => console.log(response))
    .catch(err =>{
        console.log(err);
    })
    await loadMemoList()
}

loadMemoList()




