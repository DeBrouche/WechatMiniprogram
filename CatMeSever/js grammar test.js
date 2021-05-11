let result = {};

result.status=1
result.posts_even = []
result.posts_odd = []

let items = [0,1,2,3,4,5,6,7,8,9,10,11,12]
for(let i = 0; i < items.length ; i++){
    let evenoddIndex = i / 2;

    if(i%2 == 0){


        result.posts_even[evenoddIndex] = items[i];
    }else {
        evenoddIndex -= 0.5
        result.posts_odd[evenoddIndex] = items[i];
    }
}
let l1 = result.posts_even.length
for(let i = 0; i < l1; i++){
    console.log(result.posts_even[i])
}
console.log("even ended")
let l2 = result.posts_odd.length
for(let i = 0; i < l2; i++){
    console.log(result.posts_odd[i])
}