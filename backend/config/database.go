package config

import (
	"log"

	"github.com/longdaica/my-app/backend/model"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

func ConnectDB() *gorm.DB {
	dsn := "longdaica:123456@tcp(127.0.0.1:3307)/app_db?charset=utf8mb4&parseTime=True&loc=Local"

	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("❌Ket noi that bai: ", err)
	}
	log.Println("✅ Kết nối MySQL thành công!")

	err = db.AutoMigrate(&model.User{})
	if err != nil {
		log.Fatal("❌ Lỗi tạo bảng:", err)
	}
	return db
}
