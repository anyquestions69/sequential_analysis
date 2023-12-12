const fs = require('fs')
const natural = require('natural');
const stemmer = natural.PorterStemmerRu

const stop_symbols = '.,!?:;"-\n\r()«»'
const authors={}
const symbols = [',', '.', '?', '!', ':', ';', '(', '–', '+', '-', '"', "'"]
const suffArray = ['оньк','ёньк','енк','ник','щик','тель','очк','ушк','юшк','ышк','ниц','ся ','ть',' де',' гипо',' анти',' квази',' дис',' дез',' контр',' макро',' ре',' суб',' экс',' пост']
const suffix = /оньк|ёньк|енк|ник|щик|тель|ик|ек|очк|ушк|юшк|ышк|ниц|ся |ть| анти| архи| квази| гипер| гипо| де| дез| дис| ин| интер| инфра| квази| кило| контр| макро| микро| мега| мата| мульти| орто| пан| пара| пост| прото| ре| суб| супер| транс| ультра| экстра| экс| о/g
var text = fs.readFileSync(__dirname+'/input.txt').toString('utf-8');
console.log(text)
fs.readdir(__dirname+'/authors', function(err, files) {
    var words=stemText(text)
    var textSymb=specSymbols(text)
    var suff = suffixAnalyze(text)
    console.log(`Автор - Лексемы - Спец символы - Суффиксы`)
    files.forEach(file => {
        if(file!='.gitkeep') {
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
                author['sum']['suff']+=parseFloat(Math.sqrt((parseFloat(suff[s])-parseFloat(author['suff'][s]))**2))
            }
        }
        console.log(`${auth} - ${author['sum']['word']} - ${author['sum']['symb']} - ${author['sum']['suff']}`)
        for(let p in author['sum']){
            //console.log(author['sum'][p])
            author['total']+=parseFloat(author['sum'][p])
        }
        author['total']+=parseFloat(Math.sqrt(author['sum']['suff']))
        console.log(author['total'])
        
        });
    }  
    })
  }
  )
function specSymbols(input){ //функция создания частотных словарей специальных символов
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
    return signObj
}
function suffixAnalyze(input){ //функция создания частотных словарей суффиксов
    let obj ={}
    for(let s of suffArray){
        let count = (input.match(s) || []).length;
        obj[s]=count
        
    }
    for(let s in obj){
        obj[s]=obj[s]/input.length
    }
   
    return obj
}
function createAuthor(name, input){ //функция создания частотных словарей лексем
    for(let i of stop_symbols){
        input = input.replaceAll(i,' ').toLowerCase()
    }
    let stemmedText= input.replace(/\r?\n|\r/g, "").split(' ').map(word => stemmer.stem(word))
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



function stemText(input){ //функция создания частотного словаря исходного текста
    let wordObj={}
    for(let i of stop_symbols){
        input = input.replaceAll(i,' ').toLowerCase()
    }
    let stemmedText= input.replace(/\r?\n|\r/g, "").split(' ').map(word => stemmer.stem(word))
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




