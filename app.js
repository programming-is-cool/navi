const Discord = require('discord.js');
const client = new Discord.Client();
const { discordBotToken, eBayAppID } = require('./config.json')
const ebayCommand = require('./commands').ebayCommand
const completedListingsRequest = require('./eBayApi/findingReq').completedListingsRequest
const getSold = require('./eBayApi/utils/parsing').getSold
const calculations = require('./eBayApi/utils/calculations')


client.on('ready', () => {
    console.log(`${ client.user.tag } logged in.`)
});

client.on('message', (msg) => {
    if(msg.content.startsWith(ebayCommand)) {
        let keyword = msg.content.slice(ebayCommand.length);
        completedListingsRequest(eBayAppID, keyword)
        .then((data) => {
            const statusRes = data.findCompletedItemsResponse[0].ack[0];
            const listingQty = data.findCompletedItemsResponse[0].searchResult[0]['@count'];
            if (statusRes === 'Success' && listingQty > '0') {

                const itemsList = data.findCompletedItemsResponse[0].searchResult[0].item;
                const soldList = getSold(itemsList);
                const avgSalesPrice = calculations.salePriceAverage(soldList);
                const soldPct = calculations.getSoldPct(soldList, listingQty);

                msg.reply(
                    `Item quantity: ${ listingQty }
                    Average sale price: \$${ avgSalesPrice } 
                    Sold Percentage: ${ soldPct }%`
                );

            } else if (statusRes === 'Failure' || listingQty === '0') {
                msg.reply(
                    'No information from eBay was retrieved.  Check your keywords and try again.'
                );
            }
        })
        .catch((error) => {
            console.log(error);
        })
    }
});

client.login(discordBotToken)
.catch((error) => {
    console.log(
        `${error}  Please check the discordBotToken key in the config file and try again.`
    );
});