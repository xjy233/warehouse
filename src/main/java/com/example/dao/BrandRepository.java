package com.example.dao;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.example.module.Tb_brand;

public interface BrandRepository extends JpaRepository<Tb_brand, Integer>{
	//根据品牌信息进行删除
	@Query(value = "delete from tb_brand where brand=?1 ", nativeQuery = true)  
	@Modifying
	@Transactional
	public void deleteByBrand(String brand);
}
