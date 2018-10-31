package com.example.login;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.example.module.Tb_user;
import com.example.service.UserService;

import java.util.ArrayList;
import java.util.Collection;

/**
 * Created by dell on 2017/4/9.
 */
//登录验证类
@Service
public class UserDetailsServiceImple implements UserDetailsService {

    @Autowired(required = true)
    private UserService userService;//加载user的DAO操作接口

    @Override//加载用户，即验证用户登录信息
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // TODO Auto-generated method stub
        final Tb_user cUser = userService.getByUsername(username);
        if (cUser == null) {
            throw new UsernameNotFoundException(username + " cannot be found");
        }
        final Collection<SimpleGrantedAuthority> authorities = new ArrayList<>();
        
        String userType = "";
        String myExtras = "";
        switch (cUser.getExtras()) {
		case 1:
			myExtras = "TRUE";
			break;
		case 0:
			myExtras = "FALSE";
			break;
		default:
			break;
		}
        
        switch (cUser.getUserType()) {
		case 0:
			userType = "SUPERUSER";
			break;
		case 1:
			userType = "USER";
			break;
		case 2:
			userType = "NORMAL";
			break;
		default:
			break;
		}
        
        authorities.add(new SimpleGrantedAuthority(userType));//此处设置用户角色
        authorities.add(new SimpleGrantedAuthority(myExtras));
        return new org.springframework.security.core.userdetails.User(cUser.getUsername(), cUser.getPassword(), authorities);
    }

}
