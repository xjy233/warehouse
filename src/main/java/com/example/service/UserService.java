package com.example.service;

import java.util.List;

import com.example.module.Tb_user;

public interface UserService {

	public void add(Tb_user tb_user);//添加操作
	
	public void deleteByUsername(String uesrname);//根据帐号删除操作
	
	public Tb_user findByUserName(String username);//根据帐号查询
    
	public void reSetPassword(String username, String initPassword);//超管更新用户密码
	
	public void setExtras(String username, int extrasInfo);//超管更改附加功能的值
	
	public List<Tb_user> backWareMan(int userType);//返回所有库管用户
	
	public List<Tb_user> backNormalMan(int userType);//返回所有普通用户
	
	public Tb_user findByNameAndPassword(Tb_user user);

	public Tb_user getByUsername(String username);
	
	//public UserImformation getUserDetails();
}
