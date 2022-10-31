const random = require('random')

module.exports = (client)=>{
    // ? 定时发送随机数据
    setInterval(()=>{
        // * 定时发送更新数据
        client.emit('updateData',{
            data: [
                random.int(10, 50), 
                random.int(10, 50), 
                random.int(10, 50), 
                random.int(10, 50), 
                random.int(10, 50), 
                random.int(10, 50), 
                random.int(10, 50)
            ]
        })
    },2000)
}