/*
| 状态码   |   描述                            |
|:--------:|:----------------------------------|
| 0        | 成功                              |
| 1        | 参数验证错误                      |
| < 100    | 每个接口自定义                    |
|100-199   | 系统错误                          |
|100       | System Error                      |
|200-299   | 用户权限问题                      |
|200       | 需要用户登录                      |
|201       | 用户权限不足                      |
|202       | 用户AccessToken签名无效           |
|203       | 用户AccessToekn过期               |
|300-399   | 与第三方站点相关                  |
|300       | 接口错误                          |
|301       | SSOToken 无效                     |
|302       | SSO会话过期                       |
*/

module.exports = {
    SUCCESS: 0, // 成功

	// 业务自定义
    INVALID_PARAM: 1, // 参数验证错误

	// 100-199
    SYSTEM_ERROR: 100, // 系统错误

	// 200-299
    LOGIN_REQUIRED: 200, // 需要登录
    PERMISSION_DENIED: 201, // 权限不足，被拒绝
    INVALID_USER_TOKEN_SIGN: 202, // 用户AccessToken签名无效
    USER_TOKEN_EXPIRED: 203, // 用户AccessToken过期
    USER_NOT_EXITS: 204, // 用户不存在， 情形1: accesstoken 合法并且正确解析出来，但是查找不到用户，可能原因，用户删除

	// 300
    API_ERROR: 300, // 接口错误
    INVALID_SSO_TICKET: 301, // SSO凭据格式不正确
    INVALID_SSO_SESSION: 302, // SSO会话过期
    INVALID_SSO_BROKER: 303, // SSO Broker 不存在
    INVLAID_SSO_SIGN: 304, // 签名错误
}
