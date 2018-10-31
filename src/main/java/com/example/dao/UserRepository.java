package com.example.dao;


import java.util.List;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.example.module.Tb_user;


public interface UserRepository extends JpaRepository<Tb_user, Long>{
		
		//库管及普通用户更改密碼操作 
		@Query(value = "update tb_user set phone=?2,password=?4 where username=?1 and password=?3", nativeQuery = true) 
		@Modifying
		@Transactional
		public void upadtePassword(String username, String phone, String password, String newPassword);
	
		//根据帐号进行删除操作 
		@Query(value = "delete from tb_user where username =?1 ", nativeQuery = true)  
		@Modifying
		@Transactional
		public void deleteByUsername(String username);
	
		//根据帐号进行查询操作  
		@Query(value = "select * from tb_user where username=?1", nativeQuery = true) 
		@Transactional
		public Tb_user findByUserName(String username);
		
		//超管更新用户密码
		@Query(value = "update tb_user set password=?2 where username=?1", nativeQuery = true) 
		@Modifying
		@Transactional
		public void reSetPassword(String username, String initPassword);
		
		//超管更改附加功能的值
		@Query(value = "update tb_user set extras=?2 where username=?1", nativeQuery = true) 
		@Modifying
		@Transactional
		public void setExtras(String username, int extrasInfo);
		
		//返回所有库管用户
		@Query(value = "select * from tb_user where user_type=?1", nativeQuery = true) 
		@Transactional
		public List<Tb_user> backWareMan(int userType);
		
		//返回所有普通用户
		@Query(value = "select * from tb_user where user_type=?1", nativeQuery = true) 
		@Transactional
		public List<Tb_user> backNormalMan(int userType);
		
		//返回超管信息
		@Query(value = "select * from tb_user where user_type=?1", nativeQuery = true) 
		@Transactional
		public Tb_user backSuper(int userType);
		
		//超管根据旧密码更改新密码及设置邮箱
		@Query(value = "update tb_user set e_mail=?3,password=?4 where username=?1 and password=?2", nativeQuery = true) 
		@Modifying
		@Transactional
		public void setPassword(String username, String password, String email, String newPassword);
		
		//超管根据邮箱找回密码
		@Query(value = "update tb_user set password=?3 where username=?1 and e_mail=?2", nativeQuery = true) 
		@Modifying
		@Transactional
		public void findPassword(String username, String email, String password);
		
		//根据帐号密码查找
		@Query(value ="select * from tb_user where username=?1 and password=?2", nativeQuery = true)
		@Transactional
		public Tb_user findByNameAndPassword(String name, String password);
		
		//根据帐号查找
	    @Query(value ="select * from tb_user where username=?1", nativeQuery = true)
	    @Transactional
	    public Tb_user getByUsername(String username);

}
