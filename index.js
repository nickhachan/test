var $=document.querySelector.bind(document),
    $$=document.querySelectorAll.bind(document),
    result=$('#normal .result'),
    keys=Array.from($$('.key')),
    type=[
        {name:'normal',id:'normal',e:$('.menu__item1')},
        {name:'func',id:'func',e:$('.menu__item2')},
        {name:'objBase',id:'objBase',e:$('.menu__item3')}
    ];
$$('.menu__item').forEach(e=>{
    e.onclick=(e)=>{
        const t=e.target,isTrue=type.find(a=>a.name==t.dataset.id)
        if(isTrue){
            $$('.calc').forEach(e=>{e.style.display='none'})
            $('.calc#'+t.dataset.id).style.display='flex';
        }
    }
})
result.oninput=e=>{
if(/[^\d\*\-\+\/\.\(\)]/.test(e.data))result.value=result.value.slice(0,-1)
}
keys.forEach(a=>{
    a.onclick=e=>{
        e=e.target.innerHTML
        if(result.value==0)result.value=''
        if(e=='=')result.onchange()
        else if(e=='DEC')result.value=result.value.slice(0,-1)
        else if(e=='AC')result.value=0
        else result.value=result.value+e
    }
});
(()=>{
    var fC=type[1],
        fCE=fC.e,solv=$('.func-button-solv'),
        calc2=$('.func-result'),
        reset=$('.func-button-reset'),
        copy=$('.func-button-copy'),
        cheat=$('.func-button.func-cheat'),
        post=$('.result__img');
    window.onresize=()=>{
        speCalc()
    }
    function seperate(a){
        var reg=/(\([\d\+\-\/\.]+\)|[\d\.]+)\/(\([[\d\.]\+\-\/\.]+\)|[\d\.]+)|[\d\.]+\/[\d\.]+/
        while(reg.test(a)){
            a=a.replace(reg,function(a){
                return '<div class="math__del">'+ a.split('/').map(e=>'<span>'+e+'</span>').join('<div class="seperate"></div>')+'</div>'
            })
        }
        post.innerHTML=a.replace(/\n/g,'<br/>')
    }
    cheat.onchange=()=>speCalc()
    function speCalc(){
        var y=calc2.value.replace(/[\d\)]\(/g,e=>e[0]+'*'+e[1]).replace(/:/g,'/').replace(/\^\d+/g,e=>'**'+e.slice(1)).replace(/\-\(/g,'-1*(').replace(/&([^xy]*[xy][^xy]*)+\n/g,''),z='';
        for(var x of y.split('\n')){
            var last=''
            x= x.replace(/\?[^ ]/,e=>{last=e.slice(1);return ''})
            var r=[x]
            x=x.replace(/\([+-]*[\d\.]+\)\*\*[+-]*[\d\.]+|[+-]*[\d\.]+\*\*[+-]*[\d\.]+/g,e=>e.replace(/[\(\)]/g,'').split('**').reduce((a,b)=>a**b))
            if(cheat.checked&&x!=r[0])r.push('='+x)
            while(/\([\+\-\*\/\d\.]+\)/.test(x))x= x.replace(/\([\+\-\*\/\d\.]+\)/g,e=>eval(e))
            if(cheat.checked&&!r[r.length-1].includes(x))r.push('='+x)
            x=x.replace(/\([+-]*[\d\.]+\)\*\*[+-]*\d+|[+-]{0,1}[\d\.]+\*\*[+-]*\d+/g,e=>e.replace(/[\(\)]/g,'').split('**').reduce((a,b)=>a**b))
            if(cheat.checked&&!r[r.length-1].includes(x))r.push('='+x)
            x=x.replace(/[\d\+\-\*\/\. ]+/g,(e)=>eval(e))
            if(cheat.checked&&!r[r.length-1].includes(x))r.push('='+x)
            r=r.length>1?r.join(''):x;
            r= r.replace(/[a-zA-Z=]/g,' $& ').replace(/\d\.\d+/g,e=>e.length>5?(+e).toFixed(5):e)
            z+=r+last+'\n'
        }
        seperate(z)
    };
    calc2.onchange=(e)=>{
        speCalc()
    };
    reset.onclick=()=>{calc2.value=''}
    copy.onclick=()=>{navigator.clipboard.writeText(post.textContent)}
})();
(()=>{
    var x=$('#objBase'), inp=$('.obj-func'),out=$('.obj-out'),hold=$('.obj-holder'),cas='',t={}
    function calcIt(){
        out.innerHTML=eval(cas.replace(/[a-zA-Z]+/g,'t["$&"]').replace(/\d+[\(a-zA-Z]/g,e=>e.slice(0,-1)+'*'+e.slice(-1)))
    }
    inp.onchange=(e)=>{
        e=e.target.value
        hold.innerHTML=out.innerHTML='',t={}
        cas=e
        var str=Array.from(new Set(e.match(/[a-z]+/g)))
        for(var i of str){
            t[i]=0
            var note=document.createElement('input')
            note.className='key'+i
            note.placeholder='insert: '+i
            note.dataset.id=i
            note.oninput=(a)=>{
                t[a.target.dataset.id]=+a.target.value
                if(/[a-zA-Z]/.test(a.data))a.target.value=a.target.value.slice(0,-1)
                else calcIt()
            }
            hold.appendChild(note)
        }
    }
})()
type[1].e.click()
