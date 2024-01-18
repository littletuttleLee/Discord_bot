const printlist = (data) =>{
    const list = [];

    for(let i=0;i<data.length;i++){
        list[list.length] = 
            {
                label: data[i]["title"],
                value: data[i]["title"],
            }
        
    }

    //console.log(list)

    const d = {
        content: `干飯清單`,
        type:1,
        components: [{
            type: 1,
            components: [
                {
                type: 3,
                custom_id: `class_select_foodlist`,
                options:list,
            "placeholder": "Choose a class", //提示字元
            "min_values": 1,
            "max_values": 1
            }
          ]

      }]
  }

    return d;
}


const randomfood = (data) =>{
    //Math.floor((Math.random() * (max - min)) + min)
    let randomnum = Math.floor((Math.random() * data.length));
    
    let Daytime = (data[randomnum]["BusinessDay"]);

    let week = 0;
    
    if((new Date()).getDay() == 0){
        week = 7;
    }else{
        week = (new Date()).getDay()
    }

    let checksum = 0;

    for(let i=0;i<data.length;i++){
        if(data[i]["BusinessDay"].indexOf(week)==-1){
            checksum+=1;
        }
    }

    if(checksum==0){return "今天沒有吃的QAQ"}

    while (Daytime.indexOf(week)==-1){
        //console.log(data[randomnum]["title"],Daytime)
        randomnum = Math.floor((Math.random() * data.length));
        Daytime = (data[randomnum]["BusinessDay"]);
    }
    
    
    //console.log(data[randomnum]["title"]);
    return data[randomnum]["title"];
    
}

const makebuttom = (data) =>{
    if(data == "今天沒有吃的QAQ"){return "今天沒有吃的QAQ"}

    const d={
        "content": `吃點 ${data} 行嗎`,
        "components": [
            {
                "type": 1,
                "components": [
                    {
                        "type": 2,
                        "label": "好耶!",
                        "style": 3,
                        "custom_id": "click_one"
                    },
                    {
                      "type": 2,
                      "label": "換別的吧",
                      "style": 2,
                      "custom_id": "click_cancel"
                  }
                ]
    
            }
        ]
      }

    return d;
}

exports.printlist=printlist;
exports.randomfood=randomfood;
exports.makebuttom=makebuttom;