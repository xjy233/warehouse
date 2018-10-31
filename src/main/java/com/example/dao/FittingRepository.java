package com.example.dao;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.example.module.Tb_fitting;

public interface FittingRepository extends JpaRepository<Tb_fitting, Integer>{
	//根据型号信息进行删除
	@Query(value = "delete from tb_fitting where fitting=?1 ", nativeQuery = true)  
	@Modifying
	@Transactional
	public void deleteByfitting(String fitting);
}
