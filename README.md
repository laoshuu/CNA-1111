# CNA-1111
### 連線方法：
    前端：
        1. 進到 frontend/src/utils/index.js，將 line 24 的 serverIP 變數改成 server 的 IPv4 Address
        2. 進入 terminal，在 frontend 資料夾下輸入指令 yarn start
    後端：
        1. 進到 backend/src/server.js，將 line 30 的 serverIP 變數改成此裝置的 IPv4 Address
        2. 進入 terminal，在 backend 資料夾下輸入指令 yarn server

    若後端與資料庫連線成功，後端 terminal 會出現：
        'Example app listening on port <IP address>:4000!'
        'MongoDB connected!'
        'mongo db connection created'
    若前端與後端連線成功，後端 terminal 會出現：
        'Client connected'
