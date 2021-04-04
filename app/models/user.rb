class User < ApplicationRecord
    validates :name, presence: true
    validates :email, format: { with: URI::MailTo::EMAIL_REGEXP }, presence: true, uniqueness: true
    validates :phone, presence: true
    validates :title, presence: true
    validates :status, presence: true
end
