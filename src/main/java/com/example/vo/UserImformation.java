package com.example.vo;



/**
 * Created by dell on 2017/4/28.
 */
public class UserImformation {
    private String username;//用户账号
    private String Name;//用户姓名
    private boolean ifUpdatePw;//是否需要修改密码
    private boolean ifUpdateEm;//是否需要填写初始邮箱
    private int Role;//用户角色
    private int Extras;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getName() {
        return Name;
    }

    public void setName(String name) {
        Name = name;
    }

    public int getRole() {
        return Role;
    }

    public void setRole(int role) {
        Role = role;
    }

    public int getExtras() {
        return Extras;
    }

    public void setExtras(int extras) {
        Extras = extras;
    }

    public UserImformation() {
    }

	public boolean isIfUpdatePw() {
		return ifUpdatePw;
	}

	public void setIfUpdatePw(boolean ifUpdatePw) {
		this.ifUpdatePw = ifUpdatePw;
	}

	public boolean isIfUpdateEm() {
		return ifUpdateEm;
	}

	public void setIfUpdateEm(boolean ifUpdateEm) {
		this.ifUpdateEm = ifUpdateEm;
	}
    
    
}