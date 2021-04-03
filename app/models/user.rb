class User < ApplicationRecord
    as_enum :gender, active: 1, inactive: 0
end
