package com.example.dao;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.example.module.Tb_provider;


public interface ProviderRepository extends JpaRepository<Tb_provider, Integer>{
		
		//根据供应商信息进行删除操作 
		@Query(value = "delete from tb_provider where provider=?1 ", nativeQuery = true)  
		@Modifying
		@Transactional
		public void deleteByproInfo(String provider);
}
