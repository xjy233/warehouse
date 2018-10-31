package com.example.serviceimpl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.dao.UserRepository;
import com.example.module.Tb_user;
import com.example.service.UserService;

@Service
public class UserServiceImpl implements UserService{
	@Autowired
	private UserRepository userRepository;
	
	@Override
	public void add(Tb_user tb_user) {
		userRepository.save(tb_user);
	}

	@Override
	public void deleteByUsername(String uesrname) {
		userRepository.deleteByUsername(uesrname);
		
	}

	@Override
	public Tb_user findByUserName(String username) {
		return userRepository.findByUserName(username);
	}

	@Override
	public void reSetPassword(String username,String initPassword) {
		userRepository.reSetPassword(username,initPassword);
	}

	@Override
	public void setExtras(String username, int extrasInfo) {
		userRepository.setExtras(username, extrasInfo);
	}

	@Override
	public List<Tb_user> backWareMan(int userType) {
		List<Tb_user> listUser = userRepository.backWareMan(userType);
		return listUser;
	}

	@Override
	public List<Tb_user> backNormalMan(int userType) {
		List<Tb_user> listUser = userRepository.backNormalMan(userType);
		return listUser;
	}

	@Override
	public Tb_user findByNameAndPassword(Tb_user user) {
		return userRepository.findByNameAndPassword(user.getUsername(), user.getPassword());
	}

	@Override
	public Tb_user getByUsername(String username) {
		return userRepository.getByUsername(username);
	}

	
	/*public UserImformation getUserDetails(){
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Tb_user user=userRepository.getByUsername(userDetails.getUsername());
        UserImformation userImformation=new UserImformation();
        userImformation.setName(user.getName());
        userImformation.setExtras(user.getExtras());
        userImformation.setRole(user.getUserType());
        userImformation.setUsername(user.getUsername());

        return userImformation;
    }*/
	

}
