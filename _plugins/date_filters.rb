require 'time'

module Jekyll
  module AssetFilter
    def to_month(input)
      time = Time.parse(input.to_s)
      # time.month.to_s.rjust(2, '0')
      time.strftime("%B")[0..2]
    end

    def to_day(input)
      time = Time.parse(input.to_s)
      time.day.to_s
    end
  end
end

Liquid::Template.register_filter(Jekyll::AssetFilter)