function Compare(oldContent, newContent) {
    newContent = newContent.replace(/<\/p><p>/g,"\n")
    newContent = newContent.replace(/<p>/g,"")
    newContent = newContent.replace(/<\/p>/g,"\n")

    oldContent = oldContent.replace("\n","[p]")
    newContent = newContent.replace("\n","[p]")
    let relaceArr = []
    let oldArr = oldContent.split("")
    let newArr = newContent.split("")
    console.log(oldArr,newArr)

    let startIndex = -1
    newArr?.map((v,k) => {
        if (v != oldArr[k] && startIndex == -1) {
            startIndex = k
        } else  if((["\n",",","。"].indexOf(v) !== -1 ||  v == oldArr[k]) && startIndex != -1){
            var endIndex = CompareReturn(oldContent,newContent,k-1)

            relaceArr.push(startIndex)
            relaceArr.push(endIndex)
            startIndex = -1
        }
    })
    var str = ''
    var nowIndex = 0
    newArr?.map((v,k) => {
        if (relaceArr.indexOf(k) !== -1) {
            if (nowIndex == 0) {
                str += "<span class=\"v2_add\">"
                nowIndex = 1
            } else {
                str += "</span>"
                nowIndex = 0
            }
        }
        if(v == "\n"){
            str += "<br />"
        }else{
            str += v
        }
    })

    str = str.replace("[p]","<br>")
    return str
}

function CompareReturn(oldContent, newContent,endIndex){

    let oldArr = oldContent.split("")
    let newArr = newContent.split("")

    while(true){
        endIndex = endIndex-1
        if( newArr[endIndex] != oldArr[endIndex] ){
            console.log("反推",newArr[endIndex],oldArr[endIndex])
            return endIndex+1
        }
    }
}