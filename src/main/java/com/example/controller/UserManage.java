package com.example.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.example.dao.UserRepository;
import com.example.module.Tb_user;
import com.example.service.UserService;
import net.sf.json.JSONObject;

@Controller
public class UserManage {
	@Autowired
	private UserRepository userRepository;
	@Autowired
	private UserService userService;
	
	String str = "Exist";
	String str1 = "add success";
	String str2 = "delete success";
	String str3 = "update success";
	
	//进入库管管理页面，返回所有库管用户信息
	@RequestMapping("/Manage/backWareMan")
	@ResponseBody
	public JSONObject backWareMan(){
		int userType = 1;
		List<Tb_user> listUser = userRepository.backWareMan(userType);
		List<Object> allUser = new ArrayList<Object>();
		for(Tb_user tb_user:listUser){
			String username = tb_user.getUsername();
			String initPassword = tb_user.getInitPassword();
			String name = tb_user.getName();
			String phone = tb_user.getPhone();
			int extras = tb_user.getExtras();
			
			List<Object> singleUser = new ArrayList<Object>();
			singleUser.add(username);
			singleUser.add(initPassword);
			singleUser.add(name);
			singleUser.add(phone);
			singleUser.add(extras);
			allUser.add(singleUser);
		}
		JSONObject jsonObject = new JSONObject();
		jsonObject.put("allUser", allUser);
		return jsonObject;
	}
	
	//进入普通用户管理页面，返回所有普通用户信息
	@RequestMapping("/Manage/backNormalMan")
	@ResponseBody
	public JSONObject backNormalMan(){
		int userType = 2;
		List<Tb_user> listUser = userRepository.backWareMan(userType);
		List<Object> allUser = new ArrayList<Object>();
		for(Tb_user tb_user:listUser){
			String username = tb_user.getUsername();
			String initPassword = tb_user.getInitPassword();
			String name = tb_user.getName();
			String phone = tb_user.getPhone();
			int extras = tb_user.getExtras();
			
			List<Object> singleUser = new ArrayList<Object>();
			singleUser.add(username);
			singleUser.add(initPassword);
			singleUser.add(name);
			singleUser.add(phone);
			singleUser.add(extras);
			allUser.add(singleUser);
		}
		JSONObject jsonObject = new JSONObject();
		jsonObject.put("allUser", allUser);
		return jsonObject;
	}
	
	//在超级用户管理页面，点击增加用户，则录入信息后增加(用户类型：0-超级用户，1-库管，2-普通用户)
	@RequestMapping("/Manage/addUSer")
	@ResponseBody
	public JSONObject addUSer(@RequestParam("workNumber") String workNumber,@RequestParam("initPassWord") String initPassWord,
			@RequestParam("name") String name,@RequestParam("phone") String phone,@RequestParam("extras") int extras,
			@RequestParam("userType") int userType){
		String username = workNumber;
		String myinitPassWord = initPassWord;
		String myname = name;
		String myworkNumber = workNumber;
		String myphone = phone;
		String password = initPassWord;
		int myextras = extras;
		int myuserType = userType;
		
		//判断录入的账号是否存在
		List<Tb_user> listUser = userRepository.findAll();
		for(Tb_user tb_user:listUser){
			String myusername = tb_user.getUsername();
			if(myusername.equals(username)){
				JSONObject jsonObject = new JSONObject();
				jsonObject.put("backInfo", str);//账号已存在，添加失败
				return jsonObject;
			}
		}
		
		Tb_user tb_user = new Tb_user(username, password, myname, myworkNumber, myphone, myextras,
				myinitPassWord, myuserType,null);
		userService.add(tb_user);
		JSONObject jsonObject = new JSONObject();
		jsonObject.put("backInfo", str1);
		return jsonObject;
	}
	
	//在超级用户管理页面，点击删除，则删除对应用户信息
	@RequestMapping("/Manage/deleteUser")
	@ResponseBody
	public JSONObject deleteUser(@RequestParam("username") String username){
		userService.deleteByUsername(username);
		JSONObject jsonObject = new JSONObject();
		jsonObject.put("backInfo", str2);
		return jsonObject;
	}
	
	//在超级用户管理页面，勾选Extras，则更新用户是否拥有查看出库货物
	@RequestMapping("/Manage/updateExtras")
	@ResponseBody 
	public JSONObject updateExtras(@RequestParam("username") String username){
		Tb_user tb_user = userRepository.getByUsername(username);
		int myExtras = tb_user.getExtras();
		if(myExtras==1){
			int extras = 0;
			userRepository.setExtras(username, extras);
		}
		else{
			int extras = 1;
			userRepository.setExtras(username, extras);
		}
		
		JSONObject jsonObject = new JSONObject();
		jsonObject.put("backInfo", str3);
		return jsonObject;
	}
	
	//在超级用户管理页面，点击重置密码，则更新用户密码为初始密码
		@RequestMapping("/Manage/updatePassword")
		@ResponseBody 
		public JSONObject updatePassword(@RequestParam("username") String username){
			Tb_user tb_user = userRepository.findByUserName(username);
			String initPassword = tb_user.getInitPassword();
			userRepository.reSetPassword(username,initPassword);
			JSONObject jsonObject = new JSONObject();
			jsonObject.put("backInfo", str3);
	
			return jsonObject;
		}
		
	//进入仓库管理员页面，返回仓库管理员的信息(帐号,电话)
	@RequestMapping("/backUserInfo")
	@ResponseBody
	public JSONObject backUserInfo(){
		UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
	    Tb_user tb_user=userRepository.getByUsername(userDetails.getUsername());
		String myUsername = tb_user.getUsername();
		String myPhone = tb_user.getPhone();
		
		List<Object> listUserInfo = new ArrayList<Object>();
		listUserInfo.add(myUsername);
		listUserInfo.add(myPhone);
		JSONObject jsonObject = new JSONObject();
		jsonObject.put("userInfo", listUserInfo);
		return jsonObject;
	}
	
	//仓库管理员修改自己的信息,只能修改密码
	@RequestMapping("/updateUserInfo")
	@ResponseBody
	public JSONObject updateUserInfo(@RequestParam("phone") String phone,@RequestParam("oldPassword") String oldPassword,@RequestParam("newPassword") String newPassword){
		JSONObject jsonObject = new JSONObject();
		UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
	    Tb_user tb_user=userRepository.getByUsername(userDetails.getUsername());
	    String username = tb_user.getUsername();
		//判断密码是否正确
		if(tb_user.getPassword().equals(oldPassword)){
			userRepository.upadtePassword(username, phone,oldPassword, newPassword);
			jsonObject.put("backInfo", str3);//更改成功
			return jsonObject;
		}
		else{
			String str4 = "password error";
			jsonObject.put("backInfo", str4);//密码错误更改新密码失败
			return jsonObject;

		}	
	}
	
	//超管个人信息页面，返回超管的账号，邮箱
	@RequestMapping("/Manage/backSupreInfo")
	@ResponseBody
	public JSONObject backSupreInfo(){
		Tb_user tb_user = userRepository.backSuper(0);
		List<Object> listSuperInfo = new ArrayList<Object>();
		String email = tb_user.geteMail();
		if(email==null){
			email="";
		}
		listSuperInfo.add(tb_user.getUsername());
		listSuperInfo.add(email);
		
		System.out.println(listSuperInfo.toString());
		JSONObject jsonObject = new JSONObject();
		jsonObject.put("backInfo", listSuperInfo);
		return jsonObject;
	}
	
	//超管个人信息页面，根据旧密码更改邮箱及新密码
	@RequestMapping("/Manage/superChangePassword")
	@ResponseBody
	public JSONObject superChangePassword(@RequestParam("email") String email,@RequestParam("oldPassword") String oldPassword,
			@RequestParam("newPassword") String newPassword){
		JSONObject jsonObject = new JSONObject();
		Tb_user tb_user = userRepository.findByUserName("admin");
		//判断密码是否正确
		if(tb_user.getPassword().equals(oldPassword)){
			userRepository.setPassword("admin", oldPassword, email, newPassword);
			jsonObject.put("backInfo", str3);//更改成功
			return jsonObject;
		}
		else{
			String str4 = "password error";
			jsonObject.put("backInfo", str4);//密码错误更改新密码失败
			return jsonObject;

		}	
	}
	
	//超管根据邮箱找回密码	 
	@RequestMapping("/Manage/superFindPassword")
	@ResponseBody
	public JSONObject superFindPassword(@RequestParam("email") String email,@RequestParam("password") String password){
		JSONObject jsonObject = new JSONObject();
		try {
			userRepository.findPassword("admin", email, password);
		} catch (Exception e) {
			String str5 = "email error";
			jsonObject.put("backInfo", str5);//邮箱错误更改密码失败
			return jsonObject;
		}
		jsonObject.put("backInfo", str3);//更改成功
		return jsonObject;
	}
	
}
