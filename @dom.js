export function createDom(fibre){
   // console.log(fibre,'fibre')
        let dom = fibre.type!='TEXT_ELEMENT'?document.createElement(fibre.type):document.createTextNode(fibre.props.nodeValue)
        Object.keys(fibre.props).map(proprety=>{
            if(proprety !== 'children') dom[proprety]=fibre.props[proprety]
        })
        return dom
}