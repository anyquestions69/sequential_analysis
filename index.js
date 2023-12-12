//const { sign } = require('crypto');
const fs = require('fs')
const natural = require('natural');
const stemmer = natural.PorterStemmerRu

const stop_symbols = '.,!?:;"-\n\r()«»'
const authors={}
const symbols = [',', '.', '?', '!', ':', ';', '(', '–', '-', '"', "'"]
const suffArray = ['оньк','ёньк','енк','ник','щик','тель','очк','ушк','юшк','ышк','ниц','ся ','ть',' де',' гипо',' анти',' квази',' дис',' дез',' контр',' макро',' ре',' суб',' экс',' пост']
const suffix = /оньк|ёньк|енк|ник|щик|тель|ик|ек|очк|ушк|юшк|ышк|ниц|ся |ть| анти| архи| квази| гипер| гипо| де| дез| дис| ин| интер| инфра| квази| кило| контр| макро| микро| мега| мата| мульти| орто| пан| пара| пост| прото| ре| суб| супер| транс| ультра| экстра| экс| о/g
var text = `Дождь, однако же, казалось, зарядил надолго. Лежавшая на дороге пыль быстро замесилась в грязь, и лошадям ежеминутно становилось тяжеле тащить бричку. Чичиков уже начинал сильно беспокоиться, не видя так долго деревни Собакевича. По расчету его, давно бы пора было приехать. Он высматривал по сторонам, но темнота была такая, хоть глаз выколи. — Селифан! — сказал он наконец, высунувшись из брички. — Что, барин? — отвечал Селифан. — Погляди-ка, не видно ли деревни? — Нет, барин, нигде не видно! — После чего Селифан, помахивая кнутом, затянул песню не песню, но что-то такое длинное, чему и конца не было. Туда все вошло: все ободрительные и побудительные крики, которыми потчевают лошадей по всей России от одного конца до другого; прилагательные всех родов без дальнейшего разбора, как что первое попалось на язык. Таким образом дошло до того, что он начал называть их наконец секретарями.`

fs.readdir(__dirname+'/authors', function(err, files) {
    var words=stemText(text)
    var textSymb=specSymbols(text)
    var suff = suffixAnalyze(text)
    files.forEach(file => {
      let auth = file.split('.')[0]
      fs.readFile(__dirname+'/authors/'+file, 'utf8', function(err, data) {
        if (err) {
          console.error(err);
          return;
        }
        
        let author={}
        author['words']=createAuthor(auth, data)
        author['symb']={}
        author['symb']=specSymbols(data)
        author['suff']=suffixAnalyze(data)
        let sum=0
        author['sum']={
            word:0,
            symb:0,
            suff:0
        }
        author['total']=0
        for(let word in words){
            
            if(author['words'][word] && words[word]){
                author['sum']['word']+=parseFloat((parseFloat(words[word])-parseFloat(author['words'][word]))**2)
            }
        }
        for(let s in author['symb']){
            if(author['symb'][s] && textSymb[s]){
                author['sum']['symb']+=parseFloat((parseFloat(textSymb[s])-parseFloat(author['symb'][s]))**2)
            }
        }
        for(let s in author['suff']){
            if(author['suff'][s] && suff[s]){
                author['sum']['suff']+=parseFloat((parseFloat(suff[s])-parseFloat(author['suff'][s]))**2)
            }
        }
        console.log(`${auth} - ${author['sum']['word']} - ${author['sum']['symb']} - ${author['sum']['suff']}`)
        for(let p in author['sum']){
            author['total']+=author['sum'][p]
        }
        console.log(author['total'])
        
        });
           
    })
  }
  )
function specSymbols(input){
    let signObj={}
    for(let ch of input){
        for(let s of symbols){
            if(s==ch){
                if(!signObj[ch])signObj[ch]=0
                signObj[ch]++
            }
            
        }
        
    }
    for(let s in signObj){
        signObj[s]=signObj[s]/input.length
    }
    //console.log(signObj)
    return signObj
}
function suffixAnalyze(input){
    let obj ={}
    for(let s of suffArray){
        let count = (input.match(s) || []).length;
        obj[s]=count
        
    }
    for(let s in obj){
        obj[s]=obj[s]/input.length
    }
   
    return obj
    //var count = (input.match(suffix) || []).length;
    
}
function createAuthor(name, input){
    for(let i of stop_symbols){
        input = input.replaceAll(i,' ').toLowerCase()
    }
    let stemmedText= input.split(' ').map(word => stemmer.stem(word))
    if(!authors[name])authors[name]={}
    for(let word of stemmedText){
        if(word!=''){
            if(!authors[name][word])authors[name][word]=0
            authors[name][word]++
        }
    }
    for(let word in authors[name]){
        authors[name][word]=authors[name][word]/stemmedText.length
        
    }
    return authors[name]
}



function stemText(input){
    let wordObj={}
    for(let i of stop_symbols){
        input = input.replaceAll(i,' ').toLowerCase()
    }
    let stemmedText= input.split(' ').map(word => stemmer.stem(word))
    for(let word of stemmedText){
        for(let i of stop_symbols){
            word.replace(i,'').toLowerCase()
        }
        if(!wordObj[word])wordObj[word]=0
        wordObj[word]++
    }
    
    for(let word in wordObj){
        wordObj[word]=wordObj[word]/stemmedText.length
    }
    return wordObj    
}




