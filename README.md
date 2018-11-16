# 簡易回報系統
Simple report system for PC classroom, let user easily report problems to admin.

> 本系統目前用於國立成功大學（National Cheng Kung University）資訊工程系館中的電腦教室。
> 

## Deployment

### Heroku
* [Report page - `/api/v1`](https://simple-report-system.herokuapp.com/api/v1)
    * 提供基本的錯誤回報功能
    * 回報者不需要註冊身份即可匿名回報
* [User login/register page - `/api/v1/login`](https://simple-report-system.herokuapp.com/api/v1/login)
    * 註冊/登入管理者
    * 管理回報紀錄、針對回報紀錄做出修繕事宜、疑難排除
    * **註冊** 需要 PC 助教提供的密鑰

## Development

* 原始碼只需要補上 `routes/v1/.dbconfig.json` 這個檔案就可以使用（ 內含 database 相關的設定、以及管理者註冊使用的 secret key ），若要用於自己的場域，簡單補上這個檔案設定即可。
* 目前開發環境使用的是 `MySQL`
* `.dbconfig.json` 格式：
```json
{
    "db_schema": "name of Database",
    "db_username": "owner of Database",
    "db_userpasswd": "Owner's password",
    "db_host": "Host IP address",
    "secret_key": "your secret key shared among administers"
}
```
* **若有興趣一起維護成大資訊的這個 heroku distribution**，歡迎寄信給我 (kevinbird61@gmail.com) 來索取 `.dbconfig.json` 設定檔！

## Misc

* [Heroku 上部署的一二事](https://hackmd.io/ZnghTqgHR4qRDU1_MlE07Q)

# Author 
* Kevin Cyu, kevinbird61@gmail.com