function checkSellingState (listingArray) {
    let status = listingArray.sellingStatus;
    return (
        status ? status[0].sellingState[0] : '--'
    );
}

function getSold (itemsList) {
    let soldList = [];
    for(let i=0; i < itemsList.length; i++) {    
        if (checkSellingState(itemsList[i]) === 'EndedWithSales') {
            soldList.push(itemsList[i]);
        }
    }
    return soldList;
}

module.exports.getSold = getSold;