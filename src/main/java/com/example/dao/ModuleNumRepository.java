package com.example.dao;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.example.module.Tb_modulenum;

public interface ModuleNumRepository extends JpaRepository<Tb_modulenum, Integer>{
	//根据模板信息进行删除
	@Query(value = "delete from tb_modulenum where moduleNum =?1 ", nativeQuery = true)  
	@Modifying
	@Transactional
	public void deleteBymoduleNum(String moduleNum);
	
	//g根据模板信息查询
	@Query(value = "select * from tb_modulenum where moduleNum=?1 ", nativeQuery = true)  
	@Transactional
	public Tb_modulenum findByModuleNum(String moduleNum);
}
