1200.times do
    User.create({
        name: Faker::Name.name,
        phone: Faker::PhoneNumber.cell_phone_in_e164,
        email: Faker::Internet.email,
        title: Faker::Job.title
    })
end