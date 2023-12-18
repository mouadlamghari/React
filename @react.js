import { createDom } from "./@dom.js"


function createElement(type,props,...children){
    return {
        type,
        props:{
            ...props,
            children:children.map((child=>
                {return typeof child == 'object' ? child : createTextElement(child)}
            ))
        },
    }
}


function createTextElement(text){
    return {
        type:'TEXT_ELEMENT',
        props:{
            nodeValue:text,
            children:[]
        }
    }
}




function render(element,container){
    nextUnitOfWork = {
        dom:container,
        props:{
            children : [element]
        }
    }
}


let nextUnitOfWork = null


function workLoop(deadLine){

    let shouldYield = false;

    while(!shouldYield && nextUnitOfWork ){
        nextUnitOfWork = preformUnitWork(nextUnitOfWork)

        shouldYield = deadLine.timeRemaining()<1
    }

    requestIdleCallback(workLoop)
}

function preformUnitWork(fiber){
    if(!fiber.dom){
        fiber.dom=createDom(fiber)
    }
    if(fiber.parent){
        fiber.parent.dom.appendChild(fiber.dom)
    }

    let elements = fiber.props.children
    let index = 0
    let prevsibling = null
    while(index<elements.length){
        let element = elements[index]
        const newFiber = {
            type:element.type,
            props:element.props,
            parent:fiber,
            dom:null
        }
        if(index==0){
            fiber.child=newFiber
        }
        else{
            prevsibling.sibling=newFiber
        }
        prevsibling=newFiber

        index++
    }
    console.log({fiber})
    if(fiber.child){
        return fiber.child
    }
    let nextFiber = fiber
    while(nextFiber){
        console.log({nextFiber})
        if(nextFiber.sibling){
            return nextFiber.sibling
        }
        nextFiber = nextFiber.parent
    }
    return null
}


requestIdleCallback(workLoop)



window.React={
    createElement,
    render
}