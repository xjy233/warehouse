package com.example.serviceimpl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.dao.PackageRepository;
import com.example.module.Tb_package;
import com.example.service.PackageService;

@Service
public class PackageServiceImpl implements PackageService{
	@Autowired
	private PackageRepository packageRepository;
	@Override
	public String add(Tb_package tb_package) {
		packageRepository.save(tb_package);
		int id = packageRepository.getNewId();
		String pacID = String.format("%08d", id);
		packageRepository.addPacID(id,pacID);//添加包裹ID
		return pacID;
	}

	@Override
	public void deleteById(int Id) {
		packageRepository.delete(Id);
	}

	
	@Override
	public Tb_package findBypackageID(String pacId) {
		return packageRepository.findBypackageID(pacId);
	}

	@Override
	public void updateStation(String Id, int station) {
		packageRepository.updateStation(Id, station);
		
	}

	@Override
	public List<Tb_package> findByPosInfo(String positionInfo) {
		return packageRepository.findByPosInfo(positionInfo);
	}
	
	//去除list集合里的重复值
	public List<String> removeDuplicate(List<String> list)   { 
		for  ( int i = 0;i < list.size() - 1;i++){ 
			for  ( int j = list.size() - 1;j > i;j--){ 
				if  (list.get(j).equals(list.get(i))){ 
				        list.remove(j); 
				      } 
				    } 
				  } 
				  return  list;
			}
	
}
